using System.Text.Json;
using System.Text.Json.Nodes;
using LocalApi.Data;
using LocalApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalApi.Controllers;

[ApiController]
[Route("api/entities/{entity}")]
public class EntitiesController(AppDbContext db) : ControllerBase
{
    private static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
    { "Car", "Brand", "GalleryImage", "Visit", "Review", "User", "Contact", "News" };

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List(string entity, [FromQuery] string? sort = null, [FromQuery] int limit = 100, [FromQuery] string? filter = null)
    {
        if (!Allowed.Contains(entity)) return NotFound();
        var rows = await db.EntityRecords.Where(x => x.EntityType == entity).ToListAsync();
        var parsed = rows.Select(ToNode).Where(x => Matches(x, filter)).ToList();
        if (!string.IsNullOrWhiteSpace(sort))
        {
            var desc = sort.StartsWith('-'); var field = sort.TrimStart('-');
            parsed = (desc ? parsed.OrderByDescending(x => SortValue(x, field)) : parsed.OrderBy(x => SortValue(x, field))).ToList();
        }
        return Ok(parsed.Take(Math.Clamp(limit, 1, 500)));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(string entity, Guid id)
    {
        var row = await db.EntityRecords.FirstOrDefaultAsync(x => x.EntityType == entity && x.Id == id);
        return row is null ? NotFound() : Ok(ToNode(row));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create(string entity, [FromBody] JsonObject data)
    {
        if (!Allowed.Contains(entity)) return NotFound();
        // Public entities needed by the website. Admin entities require an admin token.
        if (!PublicCreate.Contains(entity) && !User.IsInRole("admin")) return Forbid();
        var now = DateTime.UtcNow; var id = Guid.NewGuid();
        var node = Clean(data); node["id"] = id.ToString(); node["created_date"] = now.ToString("O"); node["updated_date"] = now.ToString("O");
        var row = new EntityRecord { Id = id, EntityType = entity, Data = node.ToJsonString(), CreatedDate = now, UpdatedDate = now };
        db.EntityRecords.Add(row); await db.SaveChangesAsync(); return Ok(ToNode(row));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(string entity, Guid id, [FromBody] JsonObject data)
    {
        var row = await db.EntityRecords.FirstOrDefaultAsync(x => x.EntityType == entity && x.Id == id);
        if (row is null) return NotFound();
        var node = JsonNode.Parse(row.Data)?.AsObject() ?? new JsonObject();
        foreach (var kv in data) node[kv.Key] = kv.Value?.DeepClone();
        node["id"] = id.ToString(); node["created_date"] = row.CreatedDate.ToString("O"); node["updated_date"] = DateTime.UtcNow.ToString("O");
        row.Data = node.ToJsonString(); row.UpdatedDate = DateTime.UtcNow; await db.SaveChangesAsync(); return Ok(ToNode(row));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string entity, Guid id)
    {
        var row = await db.EntityRecords.FirstOrDefaultAsync(x => x.EntityType == entity && x.Id == id);
        if (row is null) return NotFound(); db.EntityRecords.Remove(row); await db.SaveChangesAsync(); return NoContent();
    }

    private static readonly HashSet<string> PublicCreate = new(StringComparer.OrdinalIgnoreCase) { "Contact", "Visit" };
    private static JsonObject Clean(JsonObject data) => data.DeepClone().AsObject();
    private static JsonObject ToNode(EntityRecord r)
    {
        var n = JsonNode.Parse(r.Data)?.AsObject() ?? new JsonObject();
        n["id"] = r.Id.ToString(); n["created_date"] = r.CreatedDate.ToString("O"); n["updated_date"] = r.UpdatedDate.ToString("O"); return n;
    }
    private static bool Matches(JsonObject x, string? filter)
    {
        if (string.IsNullOrWhiteSpace(filter)) return true;
        try { var f = JsonNode.Parse(filter)?.AsObject(); if (f is null) return true; foreach (var kv in f) if (!JsonNode.DeepEquals(x[kv.Key], kv.Value)) return false; return true; }
        catch { return true; }
    }
    private static string SortValue(JsonObject x, string field) => x[field]?.ToJsonString() ?? "";
}
