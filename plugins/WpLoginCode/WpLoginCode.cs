using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Core.Attributes;
using CounterStrikeSharp.API.Modules.Commands;
using MySqlConnector;

namespace WpLoginCode;

public class Config
{
    public string DatabaseHost { get; set; } = "127.0.0.1";
    public int DatabasePort { get; set; } = 3307;
    public string DatabaseUser { get; set; } = "cs2";
    public string DatabasePassword { get; set; } = "";
    public string DatabaseName { get; set; } = "weaponpaints";
    public string SiteUrl { get; set; } = "https://skins.daviduarte.com.br";
    public int CodeTtlSeconds { get; set; } = 300;
}

[MinimumApiVersion(80)]
public class WpLoginCodePlugin : BasePlugin
{
    public override string ModuleName => "WpLoginCode";
    public override string ModuleVersion => "1.0.0";
    public override string ModuleAuthor => "Davi";
    public override string ModuleDescription => "Generates short one-time login codes for the WeaponPaints web panel on !skins chat command";

    private Config _config = new();
    private static readonly char[] CodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray();
    // Excludes I, O, 0, 1 to avoid visual confusion.

    public override void Load(bool hotReload)
    {
        LoadConfig();
        AddCommand("css_skins", "Generate a login code for the weapon paints website", OnSkinsCommand);
        AddCommand("css_site", "Generate a login code for the weapon paints website", OnSkinsCommand);
        AddCommand("css_loginweb", "Generate a login code for the weapon paints website", OnSkinsCommand);
        Console.WriteLine("[WpLoginCode] Loaded. Site URL: " + _config.SiteUrl);
    }

    private void LoadConfig()
    {
        var configDir = Path.Combine(ModuleDirectory, "config");
        var configPath = Path.Combine(configDir, "WpLoginCode.json");
        try
        {
            if (!Directory.Exists(configDir)) Directory.CreateDirectory(configDir);
            if (!File.Exists(configPath))
            {
                var defaultJson = JsonSerializer.Serialize(_config, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(configPath, defaultJson);
                Console.WriteLine("[WpLoginCode] Created default config at " + configPath);
                return;
            }
            var json = File.ReadAllText(configPath);
            var loaded = JsonSerializer.Deserialize<Config>(json);
            if (loaded != null) _config = loaded;
        }
        catch (Exception ex)
        {
            Console.WriteLine("[WpLoginCode] Config load failed: " + ex.Message);
        }
    }

    private void OnSkinsCommand(CCSPlayerController? player, CommandInfo info)
    {
        if (player == null || !player.IsValid || player.IsBot || player.IsHLTV) return;

        var steamid = player.SteamID.ToString();
        var code = GenerateCode(6);

        // Fire-and-forget DB insert. We send the chat message on the main thread
        // after the insert completes.
        Task.Run(async () =>
        {
            try
            {
                await InsertCodeAsync(code, steamid);
                Server.NextFrame(() =>
                {
                    if (!player.IsValid) return;
                    var url = _config.SiteUrl.TrimEnd('/') + "/";
                    player.PrintToChat($" \x0Cweapon paints\x01: acesse \x04{url}\x01 e use o código \x04{code}\x01 (válido por 5 min)");
                });
            }
            catch (Exception ex)
            {
                Server.NextFrame(() =>
                {
                    if (!player.IsValid) return;
                    player.PrintToChat($" \x02weapon paints\x01: erro ao gerar código. Tenta de novo.");
                });
                Console.WriteLine("[WpLoginCode] DB insert failed: " + ex.Message);
            }
        });
    }

    private async Task InsertCodeAsync(string code, string steamid)
    {
        var connString = $"Server={_config.DatabaseHost};Port={_config.DatabasePort};Database={_config.DatabaseName};User Id={_config.DatabaseUser};Password={_config.DatabasePassword};";
        await using var conn = new MySqlConnection(connString);
        await conn.OpenAsync();

        var expiresAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + _config.CodeTtlSeconds;
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO wp_login_codes (code, steamid, expires_at, used) VALUES (@code, @steamid, @expires, 0) ON DUPLICATE KEY UPDATE steamid=@steamid, expires_at=@expires, used=0";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@steamid", steamid);
        cmd.Parameters.AddWithValue("@expires", expiresAt);
        await cmd.ExecuteNonQueryAsync();
    }

    private static string GenerateCode(int length)
    {
        var sb = new StringBuilder(length);
        var rng = new Random();
        for (int i = 0; i < length; i++)
        {
            sb.Append(CodeAlphabet[rng.Next(CodeAlphabet.Length)]);
        }
        return sb.ToString();
    }
}
