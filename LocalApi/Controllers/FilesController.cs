using System.Linq;
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
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "File is required." });
        if (file.Length > 20_000_000)
            return BadRequest(new { message = "Image must be 20 MB or smaller." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp" or ".gif"))
            return BadRequest(new { message = "Only JPG, PNG, WEBP and GIF images are allowed." });

        // Validate the actual file signature; never trust the client-provided extension or MIME type.
        byte[] header = new byte[12];
        await using (var input = file.OpenReadStream())
        {
            var read = await input.ReadAsync(header.AsMemory(0, header.Length));
            var valid = ext switch
            {
                ".jpg" or ".jpeg" => read >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
                ".png" => read >= 8 && header.Take(8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }),
                ".gif" => read >= 6 && (System.Text.Encoding.ASCII.GetString(header, 0, 6) is "GIF87a" or "GIF89a"),
                ".webp" => read >= 12 && System.Text.Encoding.ASCII.GetString(header, 0, 4) == "RIFF" && System.Text.Encoding.ASCII.GetString(header, 8, 4) == "WEBP",
                _ => false
            };
            if (!valid)
                return BadRequest(new { message = "The uploaded file is not a valid image of the selected type." });
        }

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var folder = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(folder);
        var name = $"{Guid.NewGuid():N}{ext}";
        var path = Path.Combine(folder, name);
        await using (var output = System.IO.File.Create(path))
        await using (var source = file.OpenReadStream())
        {
            await source.CopyToAsync(output);
        }

        return Ok(new { file_url = $"/uploads/{name}" });
    }
}
