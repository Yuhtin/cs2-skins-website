# WpLoginCode

CounterStrikeSharp plugin that generates short one-time codes for the cs2-skins-website login-by-code flow.

## Usage (ingame)

Player types `!skins` (or `!site` / `!loginweb`) in chat. Plugin responds (visible only to that player):

```
weapon paints: acesse https://your.domain/ e use o código ABC123 (válido por 5 min)
```

Player visits the site, clicks "I have a server code", enters the code, and is logged in without going through Steam OpenID.

## Installation

1. Build with .NET 8 SDK:
   ```bash
   docker run --rm -v $PWD:/src -w /src mcr.microsoft.com/dotnet/sdk:8.0 dotnet build -c Release
   ```
2. Copy `bin/Release/net8.0/WpLoginCode.dll` and `bin/Release/net8.0/MySqlConnector.dll` to your CSS plugins folder under `plugins/WpLoginCode/`
3. On first load, a default config is written to `plugins/WpLoginCode/config/WpLoginCode.json`
4. Edit the config with your WeaponPaints MySQL credentials and site URL, then restart the server

## Requirements

- CounterStrikeSharp 1.0.365+ (adjust `MinimumApiVersion` if needed)
- The same MySQL instance used by the WeaponPaints plugin — this plugin INSERTs into the `wp_login_codes` table that the site's PHP backend reads
- Run the `backend/migrations/001_login_codes.sql` migration from cs2-skins-website on that MySQL DB first
