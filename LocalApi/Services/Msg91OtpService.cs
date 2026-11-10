using System.Text.Json;
namespace LocalApi.Services;
public sealed class Msg91OtpService(HttpClient http, IConfiguration config)
{
    private const string ApiBase = "https://control.msg91.com/api/v5/otp";
    private string AuthKey => config["MSG91_AUTH_KEY"] ?? "";
    private string TemplateId => config["MSG91_TEMPLATE_ID"] ?? "";
    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(AuthKey) || string.IsNullOrWhiteSpace(TemplateId))
            throw new InvalidOperationException("MSG91 OTP is not configured. Add MSG91_AUTH_KEY and MSG91_TEMPLATE_ID to backend environment variables.");
    }
    public async Task SendAsync(string mobile, CancellationToken ct)
    {
        EnsureConfigured();
        var url = $"{ApiBase}?template_id={Uri.EscapeDataString(TemplateId)}&mobile=91{mobile}&authkey={Uri.EscapeDataString(AuthKey)}&otp_length=6&otp_expiry=5";
        using var response = await http.GetAsync(url, ct);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode || !Success(body)) throw new InvalidOperationException(Message(body, "MSG91 could not send OTP. Check your MSG91 template and account."));
    }
    public async Task VerifyAsync(string mobile, string otp, CancellationToken ct)
    {
        EnsureConfigured();
        var url = $"{ApiBase}/verify?mobile=91{mobile}&otp={Uri.EscapeDataString(otp)}&authkey={Uri.EscapeDataString(AuthKey)}";
        using var response = await http.GetAsync(url, ct);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode || !Success(body)) throw new InvalidOperationException(Message(body, "The OTP is invalid or has expired."));
    }
    private static bool Success(string body)
    {
        try {
            using var doc = JsonDocument.Parse(body); var root = doc.RootElement;
            if (root.TryGetProperty("type", out var type)) return string.Equals(type.GetString(), "success", StringComparison.OrdinalIgnoreCase);
            if (root.TryGetProperty("status", out var status)) return string.Equals(status.ToString(), "success", StringComparison.OrdinalIgnoreCase) || string.Equals(status.ToString(), "true", StringComparison.OrdinalIgnoreCase);
        } catch { }
        return false;
    }
    private static string Message(string body, string fallback)
    {
        try { using var doc = JsonDocument.Parse(body); if (doc.RootElement.TryGetProperty("message", out var m)) return m.GetString() ?? fallback; } catch { }
        return fallback;
    }
}