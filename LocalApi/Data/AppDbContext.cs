using LocalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<EntityRecord> EntityRecords => Set<EntityRecord>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<EntityRecord>().HasIndex(x => new { x.EntityType, x.CreatedDate });
    }
}
