using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace ElCevichazo.Infrastructure.Repositories;

public class SupplierRepository : ISuppliersRepository
{
    private readonly AppDbContext _dbContext;
    public SupplierRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Supplier>> GetAllAsync()
    {
        return await _dbContext.Suppliers
            .AsNoTracking()
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

    }
    public async Task<Supplier?> GetByPhoneAsync(string phone)
    {
        return await _dbContext.Suppliers
            .FirstOrDefaultAsync(s => s.Phone == phone);
    }
    public async Task AddAsync(Supplier supplier)
    {
        await _dbContext.Suppliers.AddAsync(supplier);
        await _dbContext.SaveChangesAsync();
    }
}