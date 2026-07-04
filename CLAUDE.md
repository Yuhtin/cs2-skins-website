# CLAUDE.md

Operational notes for the deployed CS2 server + skins panel. Things in here are NOT obvious from the code — they document the live infra, recurring procedures, and temporary states. Update this file when ops state changes.

## Infra

- **Host:** `root@212.38.89.33` (Ubuntu, Docker)
- **User on host:** `cs2` (uid 1000) owns `/home/cs2/`
- **Active branch (deployed):** `master` — both this repo and `/home/cs2/skins-panel/` track it. (Merged from `feat/visual-ingame-v2` on 2026-07-03; that branch and `feat/redesign-v2` are deleted, `master` is now the GitHub default branch.)

### Docker containers

| Container | Purpose | Notes |
|---|---|---|
| `cs2-server` | CS2 dedicated server | `network_mode: host`, restart `unless-stopped`, image built from `/home/cs2/docker/Dockerfile` |
| `cs2-mysql` | MySQL 8 for WeaponPaints | port `3307` → 3306 inside, db `weaponpaints` |
| `skins-panel` | nginx + PHP-FPM | serves `/home/cs2/skins-panel/dist/`, exposes via Traefik on `skins.daviduarte.com.br` |

Compose lives at `/home/cs2/docker/docker-compose.yml`.

### Layout on the host

```
/home/cs2/cs2-server/          ← CS2 install (steamcmd target)
/home/cs2/skins-panel/         ← this repo, checked out (server-side clone)
/home/cs2/docker/              ← Dockerfile, compose, nginx config
/home/cs2/start.sh             ← legacy bare-metal launcher (still useful for diagnostics)
/home/cs2/update_cs2.sh        ← steamcmd wrapper, also re-adds metamod gameinfo line
/home/cs2/wp-backups/          ← DB and WP-plugin backups (this is where every destructive op stores rollbacks)
/home/cs2/mm-backups/          ← Metamod plugin backups (from autoupdater)
/home/cs2/css-backups/         ← CounterStrikeSharp backups (from autoupdater)
```

## CS2 server lifecycle

### Update CS2 itself
```bash
ssh root@212.38.89.33 "docker stop cs2-server && sudo -u cs2 /home/cs2/update_cs2.sh && docker start cs2-server"
```
The script runs steamcmd `+app_update 730 validate` and re-inserts the `Game csgo/addons/metamod` line into `gameinfo.gi` if Valve overwrote it.

### Critical `LD_LIBRARY_PATH` (Apr 2026)
A CS2 update on Apr 20 added `libv8.so` as a `libserver.so` dep. Bare-metal launches must export:
```bash
export LD_LIBRARY_PATH="$PWD/game/bin/linuxsteamrt64:$PWD/game/csgo/bin/linuxsteamrt64"
```
This is already in `/home/cs2/start.sh` and the docker `Dockerfile`. If a future CS2 update introduces a new shared lib not under those paths, server boot will fail with `failed to dlopen libserver.so error=<lib>: cannot open shared object file`.

### Quick logs
```bash
docker logs cs2-server --tail 100             # full stdout
docker logs cs2-server 2>&1 | grep '\[META\]\|CSSharp'   # plugin status
tail -f /home/cs2/cs2-server/game/bin/linuxsteamrt64/counterstrikesharp.log
```

## Plugin update procedure

**Auto-update pollers are DISABLED (Apr 27, 2026 — user preference: only update on breaking changes after reviewing release notes).**

Scripts are still on disk if you want to re-enable later:
```bash
# Re-enable both pollers (5-min cron via systemd)
ssh root@212.38.89.33 "systemctl enable --now mm-autoupdate.timer css-autoupdate.timer"

# One-shot manual run
ssh root@212.38.89.33 "systemctl start mm-autoupdate.service"   # or css-autoupdate.service
```

Files: `/home/cs2/{mm,css}-autoupdate.sh`, units in `/etc/systemd/system/{mm,css}-autoupdate.{service,timer}`. State files: `/home/cs2/.{mm,css}-current-build`. The MM updater handles `2.0.0.x` only and ignores the legacy `1.12.x` line.

### Manual update flow (recommended)
1. Check GitHub for latest release on `alliedmodders/metamod-source`, `roflmuffin/CounterStrikeSharp`, `Nereziel/cs2-WeaponPaints`.
2. Read the changelog — specifically look for breaking changes in CS2 ABI (signatures, interface bumps) or known regressions.
3. `docker stop cs2-server`, backup the plugin dir, extract the new release, `chown -R cs2:cs2`, `docker start cs2-server`.
4. Verify in `counterstrikesharp.log`: WP should print `Plugin is up to date` (NOT `Probably dev version detected`).

## Frontend deploy

The dist is built **on the server** inside an ephemeral node container (no node on host):
```bash
ssh root@212.38.89.33 "cd /home/cs2/skins-panel && git pull origin master && \
  docker run --rm -v /home/cs2/skins-panel:/app -w /app/frontend node:20-alpine sh -c 'npm run build'"
```

`vite build` outputs to `/home/cs2/skins-panel/dist/`, which the `skins-panel` container nginx serves directly. **No container restart needed** for frontend changes — nginx picks up new files immediately. Browser cache is the usual culprit when changes don't appear; tell users to hard-refresh.

If you build BEFORE pulling new source on the server, the dist will be stale. Always `git pull` first.

## Catalog data (skins / agents / gloves / etc.)

Source of truth is `https://github.com/ByMykel/CSGO-API` (auto-updated by a bot from the live CS2 manifest). The transform script that converts bymykel format → site format used to live at `/tmp/sync-catalogs.py` on the server (lost on reboot — re-create from git history or this file's history if needed). Current catalogs in `frontend/public/data/`:

- `skins_en.json`, `agents_en.json`, `gloves_en.json`, `music_kits_en.json`, `music_en.json`, `collectibles_en.json`
- **`stickers_en.json` and `keychains_en.json` are DELETED** — the sticker/keychain editor was removed from the UI (commit `a144270`). Don't re-add them unless reintroducing the feature.

Image URLs come from Steam's Akamai CDN (`community.akamai.steamstatic.com/economy/image/...`). No need to host PNGs locally.

## Database

MySQL container `cs2-mysql`, db `weaponpaints`. Connect:
```bash
ssh root@212.38.89.33 "docker exec -it cs2-mysql mysql -u root -pAygabztfJ2kB7V7Gu633ftp1vzwq2ENt2A1G weaponpaints"
```

Tables that matter:
- `wp_player_skins` — per `(steamid, weapon_team, weapon_defindex)` skin row (paint, wear, seed, sticker_*, keychain)
- `wp_player_knife` — `(steamid, weapon_team) → knife class name`
- `wp_player_gloves` — `(steamid, weapon_team) → glove defindex`
- `wp_player_agents` — `(steamid) → (agent_ct, agent_t)` model strings

The `weapon_team` column convention here: **2 = T, 3 = CT** (CS2 internal team IDs).

### Backup and rollback pattern
Before any destructive DB op, dump just the affected rows to `/home/cs2/wp-backups/` with a timestamp. Use `INSERT IGNORE INTO` when restoring on top of newer data so users who already reconfigured aren't overwritten:
```bash
sed 's/INSERT INTO/INSERT IGNORE INTO/g' /home/cs2/wp-backups/<file>.sql | \
  ssh root@212.38.89.33 "docker exec -i cs2-mysql mysql -u root -p<password> weaponpaints"
```

## Temporary states (re-enable when blocker clears)

### Gloves slot disabled in site UI
- **Where:** `frontend/src/components/loadout/EquipmentSection.jsx` — `disabled: true` on the gloves slot in `SLOTS_CT`/`SLOTS_T`.
- **Server-side counterpart:** `WeaponPaints.json` has `GloveEnabled: false`.
- **Reason:** WP `build-418` added `player.ExecuteClientCommand("lastinv")` inside `GivePlayerGloves` to fix model overlap. Side effect: every weapon equip triggers an animation glitch (slow draw). Author acknowledged ("a better solution may be possible").
- **Re-enable when:** WP ships a build > 418 that removes the `lastinv` calls.
  - Server: `sed -i 's/"GloveEnabled": false/"GloveEnabled": true/' /home/cs2/cs2-server/game/csgo/addons/counterstrikesharp/configs/plugins/WeaponPaints/WeaponPaints.json && docker restart cs2-server`
  - Repo: `git revert 924651b` (the gloves-disable commit) and rebuild dist.

### Sticker/keychain editor removed
Removed in commit `a144270` (Apr 25, 2026). User decided the feature wasn't at the quality bar they wanted. Existing sticker/keychain data in DB is preserved on save (the editor still echoes the values back), so no data loss when reintroducing later. To bring it back: revert `a144270`, restore the deleted catalog files from bymykel.

## Common gotchas

- **Three repos must stay aligned: local Mac, GitHub origin, server clone.** When making site changes, commit + push from local, then `git pull` on server, then rebuild dist. The user explicitly cares about this alignment — don't leave the server out of sync.
- **Do NOT rebuild dist on the server before pulling.** Always pull first; the build reads from `frontend/src/` which must be the latest committed state.
- **CS2 updates regularly break Metamod ABI.** Symptom: `FATAL ERROR: CAppSystemDict:Unable to create interface ... from server`. The fix usually arrives within 24h on the AlliedModders releases page. While waiting, the server simply can't boot — there's no temporary workaround.
- **When an agent model errors with `RESOURCE_TYPE_MODEL ... is not loaded and may have been deleted`, the user's saved agent variant was removed in a Valve update.** Check `wp_player_agents` and clear the offending rows. WP build-418 added an agents file that should validate models, but historically Valve has removed variants without notice.
- **`Probably dev version detected` in WP logs** = the plugin doesn't recognize this CS2 version. Skin/agent application may partially fail silently. Update WP to a build with a matching `Bump css version` commit.

## Helpful one-liners

```bash
# Force-check plugin update status
gh api repos/Nereziel/cs2-WeaponPaints/releases --jq '.[0].tag_name'
gh api repos/alliedmodders/metamod-source/releases --jq '.[0].tag_name'
gh api repos/roflmuffin/CounterStrikeSharp/releases --jq '.[0].tag_name'

# Plugin status from container
ssh root@212.38.89.33 "docker logs cs2-server 2>&1 | grep 'Finished loading plugin' | tail"

# DB row counts
ssh root@212.38.89.33 "docker exec cs2-mysql mysql -u root -p<pw> weaponpaints -e \
  'SELECT (SELECT COUNT(*) FROM wp_player_knife) AS knife, \
          (SELECT COUNT(*) FROM wp_player_gloves) AS gloves, \
          (SELECT COUNT(*) FROM wp_player_agents) AS agents, \
          (SELECT COUNT(*) FROM wp_player_skins) AS skins;'"

# Verify three-way alignment
echo "local: $(git log -1 --oneline)"
echo "github: $(git ls-remote origin master | awk '{print substr($1,1,7)}')"
echo "server: $(ssh root@212.38.89.33 'cd /home/cs2/skins-panel && git log -1 --oneline')"
```
