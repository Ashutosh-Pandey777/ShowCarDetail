using System.ComponentModel.DataAnnotations;

namespace LocalApi.Models;

public class AppUser
{
    [Key]
    public Guid Id { get; set; }
    [MaxLength(320)]
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    [MaxLength(30)]
    public string Role { get; set; } = "user";
    public DateTime CreatedDate { get; set; }
}
