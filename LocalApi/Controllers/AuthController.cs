using LocalApi.Data;
using LocalApi.Models;
using LocalApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LocalApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, JwtService jwt) : ControllerBase
{
    public record RegisterRequest(string Email, string Password);
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || req.Password.Length < 6) return BadRequest(new { message = "Email and password (minimum 6 characters) are required." });
        if (await db.Users.AnyAsync(x => x.Email == email)) return Conflict(new { message = "An account with this email already exists." });
        var user = new AppUser { Id = Guid.NewGuid(), Email = email, PasswordHash = PasswordService.Hash(req.Password), Role = "user", CreatedDate = DateTime.UtcNow };
        db.Users.Add(user); await db.SaveChangesAsync();
        return Ok(new { access_token = jwt.Create(user), user = ToDto(user) });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(x => x.Email == email);
        if (user is null || !PasswordService.Verify(req.Password, user.PasswordHash)) return Unauthorized(new { message = "Invalid email or password." });
        return Ok(new { access_token = jwt.Create(user), user = ToDto(user) });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(id, out var userId)) return Unauthorized();
        var user = await db.Users.FindAsync(userId);
        return user is null ? Unauthorized() : Ok(ToDto(user));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public IActionResult Forgot([FromBody] dynamic body) => Ok(new { message = "If the account exists, a reset link would be sent. Local mode does not send email." });

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public IActionResult Reset([FromBody] dynamic body) => BadRequest(new { message = "Password reset by email is not configured in local mode. Use the admin/database account or configure SMTP." });

    private static object ToDto(AppUser u) => new { id = u.Id, email = u.Email, role = u.Role, created_date = u.CreatedDate };
}
