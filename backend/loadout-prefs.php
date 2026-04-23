<?php
// Read/write the RetakesAllocator UserSettings.WeaponPreferences blob.
//
// Single table `UserSettings` (UserId BIGINT PK, WeaponPreferences TEXT JSON)
// shared with the cs2-retakes-allocator plugin running in the cs2-server
// container — see https://github.com/yonilerner/cs2-retakes-allocator
//
// JSON shape:
//   { "Terrorist": { "FullBuyPrimary": 400, "HalfBuyPrimary": 300,
//                    "PistolRound": 206, "Secondary": 200, "Preferred": 406 },
//     "CounterTerrorist": { ... } }
//
// Slot/team names are PascalCase to match the C# enums (`CsTeam`,
// `WeaponAllocationType`) — they're how the allocator's System.Text.Json
// serializer writes the dict keys, so we MUST preserve them on roundtrip.

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/class/Database.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['steamid'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$steamid = $_SESSION['steamid'];
$action = $_POST['action'] ?? '';

$db = Database::getInstance()->getConnection();
if (!$db) {
    http_response_code(500);
    echo json_encode(['errorDB' => 'Database connection failed']);
    exit;
}

// Maps frontend team strings → allocator JSON keys.
$ALLOCATOR_TEAM = ['CT' => 'CounterTerrorist', 'T' => 'Terrorist'];

// Slots the allocator understands. "Preferred" is the AWP raffle toggle.
$VALID_SLOTS = ['PistolRound', 'HalfBuyPrimary', 'FullBuyPrimary', 'Secondary', 'Preferred'];

function load_prefs($db, $steamid) {
    $stmt = $db->prepare('SELECT WeaponPreferences FROM UserSettings WHERE UserId = ?');
    $stmt->execute([$steamid]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || empty($row['WeaponPreferences'])) {
        return new stdClass(); // empty object so json_encode emits {} not []
    }
    $parsed = json_decode($row['WeaponPreferences'], false);
    return $parsed === null ? new stdClass() : $parsed;
}

function save_prefs($db, $steamid, $prefs) {
    $json = json_encode($prefs, JSON_UNESCAPED_SLASHES);
    // INSERT ... ON DUPLICATE KEY UPDATE: handles both first-time and existing
    // rows in one query, matching how the allocator's EF Core upsert works.
    $stmt = $db->prepare(
        'INSERT INTO UserSettings (UserId, WeaponPreferences) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE WeaponPreferences = VALUES(WeaponPreferences)'
    );
    $stmt->execute([$steamid, $json]);
}

switch ($action) {
    case 'get':
        echo json_encode(['prefs' => load_prefs($db, $steamid)]);
        break;

    case 'set':
        $teamInput = $_POST['team'] ?? '';
        $slot = $_POST['slot'] ?? '';
        // null/empty csItem clears the slot for that (team, slot)
        $csItemRaw = $_POST['csItem'] ?? null;

        if (!isset($ALLOCATOR_TEAM[$teamInput])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid team']);
            exit;
        }
        if (!in_array($slot, $VALID_SLOTS, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid slot']);
            exit;
        }

        $teamKey = $ALLOCATOR_TEAM[$teamInput];
        $prefs = load_prefs($db, $steamid);

        // Ensure team object exists. We use stdClass to keep json_encode emitting
        // a JSON object (not an array) when this team has no slots set yet.
        if (!isset($prefs->{$teamKey})) {
            $prefs->{$teamKey} = new stdClass();
        }

        if ($csItemRaw === null || $csItemRaw === '') {
            // Clear: drop the slot key entirely from this team's dict.
            unset($prefs->{$teamKey}->{$slot});
        } else {
            $csItem = (int) $csItemRaw;
            if ($csItem <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid csItem']);
                exit;
            }
            $prefs->{$teamKey}->{$slot} = $csItem;
        }

        save_prefs($db, $steamid, $prefs);
        echo json_encode(['success' => true, 'prefs' => $prefs]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
