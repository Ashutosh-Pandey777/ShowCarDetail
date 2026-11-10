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
public class AuthController(AppDbContext db, JwtService jwt, Msg91OtpService otpService) : ControllerBase
{
    public record RegisterRequest(string Email, string Password);
    public record LoginRequest(string Email, string Password);
    public record MobileOtpRequest(string Mobile);
    public record VerifyMobileOtpRequest(string Mobile, string Otp);
    [HttpPost("register")][AllowAnonymous]
    public async Task<IActionResult> Register(RegisterRequest req) {
        var email=req.Email.Trim().ToLowerInvariant();
        if(string.IsNullOrWhiteSpace(email)||req.Password.Length<6)return BadRequest(new{message="Email and password (minimum 6 characters) are required."});
        if(await db.Users.AnyAsync(x=>x.Email==email))return Conflict(new{message="An account with this email already exists."});
        var user=new AppUser{Id=Guid.NewGuid(),Email=email,PasswordHash=PasswordService.Hash(req.Password),Role="user",CreatedDate=DateTime.UtcNow};
        db.Users.Add(user);await db.SaveChangesAsync();return Ok(new{access_token=jwt.Create(user),user=ToDto(user)});
    }
    [HttpPost("login")][AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequest req) {
        var email=req.Email.Trim().ToLowerInvariant();var user=await db.Users.FirstOrDefaultAsync(x=>x.Email==email);
        if(user is null||!PasswordService.Verify(req.Password,user.PasswordHash))return Unauthorized(new{message="Invalid email or password."});
        return Ok(new{access_token=jwt.Create(user),user=ToDto(user)});
    }
    [HttpPost("otp/send")][AllowAnonymous]
    public async Task<IActionResult> SendMobileOtp(MobileOtpRequest req,CancellationToken ct) {
        var mobile=NormalizeMobile(req.Mobile);if(mobile is null)return BadRequest(new{message="Enter a valid 10-digit Indian mobile number."});
        try{await otpService.SendAsync(mobile,ct);return Ok(new{message="OTP sent successfully."});}
        catch(InvalidOperationException ex){return StatusCode(ex.Message.Contains("not configured",StringComparison.OrdinalIgnoreCase)?503:502,new{message=ex.Message});}
        catch(HttpRequestException){return StatusCode(502,new{message="Unable to reach MSG91. Please try again."});}
    }
    [HttpPost("otp/verify")][AllowAnonymous]
    public async Task<IActionResult> VerifyMobileOtp(VerifyMobileOtpRequest req,CancellationToken ct) {
        var mobile=NormalizeMobile(req.Mobile);
        if(mobile is null||string.IsNullOrWhiteSpace(req.Otp)||req.Otp.Length!=6||!req.Otp.All(char.IsDigit))return BadRequest(new{message="Enter a valid mobile number and 6-digit OTP."});
        try {
            await otpService.VerifyAsync(mobile,req.Otp,ct);
            var user=await db.Users.FirstOrDefaultAsync(x=>x.PhoneNumber==mobile,ct);
            if(user is null){user=new AppUser{Id=Guid.NewGuid(),Email=$"mobile-{mobile}@phone.showcardetail.local",PhoneNumber=mobile,PasswordHash="",Role="user",CreatedDate=DateTime.UtcNow};db.Users.Add(user);await db.SaveChangesAsync(ct);}
            return Ok(new{access_token=jwt.Create(user),user=ToDto(user)});
        } catch(InvalidOperationException ex){return StatusCode(ex.Message.Contains("not configured",StringComparison.OrdinalIgnoreCase)?503:401,new{message=ex.Message});}
        catch(HttpRequestException){return StatusCode(502,new{message="Unable to reach MSG91. Please try again."});}
    }
    [HttpGet("me")][Authorize]
    public async Task<IActionResult> Me(){var id=User.FindFirstValue(ClaimTypes.NameIdentifier);if(!Guid.TryParse(id,out var userId))return Unauthorized();var user=await db.Users.FindAsync(userId);return user is null?Unauthorized():Ok(ToDto(user));}
    [HttpPost("forgot-password")][AllowAnonymous]
    public IActionResult Forgot([FromBody] dynamic body)=>Ok(new{message="If the account exists, a reset link would be sent. Local mode does not send email."});
    [HttpPost("reset-password")][AllowAnonymous]
    public IActionResult Reset([FromBody] dynamic body)=>BadRequest(new{message="Password reset by email is not configured in local mode. Use the admin/database account or configure SMTP."});
    private static string? NormalizeMobile(string? value){var digits=new string((value??"").Where(char.IsDigit).ToArray());if(digits.StartsWith("91")&&digits.Length==12)digits=digits[2..];return digits.Length==10&&digits[0]>='6'&&digits[0]<='9'?digits:null;}
    private static object ToDto(AppUser u)=>new{id=u.Id,email=u.Email,mobile=u.PhoneNumber,role=u.Role,created_date=u.CreatedDate};
}