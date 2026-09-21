using Microsoft.EntityFrameworkCore;
namespace ElCevichazo.Infrastructure.database;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }
}