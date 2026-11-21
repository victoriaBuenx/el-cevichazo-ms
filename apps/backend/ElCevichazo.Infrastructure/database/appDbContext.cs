using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
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
    public DbSet<Supplier> Suppliers {get; set;} = null!;
    public DbSet<ExpenseTicket> ExpenseTickets { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<ExpenseTicket>(entity =>
        {
            entity.Property(e => e.Amount)
                .HasPrecision(18, 2);

            entity.HasOne(e => e.Supplier)
                .WithMany(s => s.ExpenseTickets)
                .HasForeignKey(e => e.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.RegisteredByUser)
                .WithMany(u => u.RegisteredExpenseTickets)
                .HasForeignKey(e => e.RegisteredByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.Property(e => e.Amount)
                .HasPrecision(18, 2);

            entity.Property(e => e.PaymentFrequency)
                .HasConversion<int>();

            entity.HasOne(e => e.Supplier)
                .WithMany(s => s.RestaurantServices)
                .HasForeignKey(e => e.SupplierId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        });
    }
}