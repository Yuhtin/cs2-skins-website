<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/class/Database.php';
session_start();

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Accept POST with {code: "ABC123"} form-encoded
$code = strtoupper(trim($_POST['code'] ?? ''));

// Format validation: 6 alphanumeric uppercase chars
if (!preg_match('/^[A-Z0-9]{6}$/', $code)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid code format']);
    exit;
}

$db = Database::getInstance()->getConnection();
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'Database unavailable']);
    exit;
}

$now = time();

// Opportunistic cleanup of old codes (single row — small DB, no cost).
$db->prepare('DELETE FROM wp_login_codes WHERE expires_at < ? - 3600')->execute([$now]);

$stmt = $db->prepare('SELECT steamid, expires_at, used FROM wp_login_codes WHERE code = ?');
$stmt->execute([$code]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Code not found']);
    exit;
}
if ((int)$row['used'] === 1) {
    http_response_code(410);
    echo json_encode(['error' => 'Code already used']);
    exit;
}
if ((int)$row['expires_at'] < $now) {
    http_response_code(410);
    echo json_encode(['error' => 'Code expired']);
    exit;
}

// Mark used
$upd = $db->prepare('UPDATE wp_login_codes SET used = 1 WHERE code = ?');
$upd->execute([$code]);

// Set session
$_SESSION['steamid'] = $row['steamid'];

echo json_encode(['ok' => true]);
