using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalApi.Controllers;

[ApiController]
[Route("api/files")]
public class FilesController(IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("upload")]
    [Authorize(Roles = "admin")]
    [RequestSizeLimit(20_000_000)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "File is required." });
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg" };
        if (!allowed.Contains(ext)) return BadRequest(new { message = "Only image files are allowed." });
        var folder = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");
        Directory.CreateDirectory(folder);
        var name = $"{Guid.NewGuid():N}{ext}"; var path = Path.Combine(folder, name);
        await using var stream = System.IO.File.Create(path); await file.CopyToAsync(stream);
        return Ok(new { file_url = $"/uploads/{name}" });
    }
}
