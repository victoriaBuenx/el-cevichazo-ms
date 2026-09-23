using Microsoft.EntityFrameworkCore;
namespace ElCevichazo.Infrastructure.Database;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }
}