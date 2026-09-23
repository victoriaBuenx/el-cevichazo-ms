using ElCevichazo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace ElCevichazo.Infrastructure.Database;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }

    public DbSet<User> Users {get; set;} = null!;
    public DbSet<RefreshToken> RefreshTokens {get; set;} = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}