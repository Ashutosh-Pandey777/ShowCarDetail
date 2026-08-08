using System.ComponentModel.DataAnnotations;

namespace LocalApi.Models;

public class EntityRecord
{
    [Key]
    public Guid Id { get; set; }
    [MaxLength(100)]
    public string EntityType { get; set; } = "";
    public string Data { get; set; } = "{}";
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
