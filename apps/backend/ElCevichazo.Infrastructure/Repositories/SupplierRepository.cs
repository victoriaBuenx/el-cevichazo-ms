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

    public async Task<Supplier?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Suppliers.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task UpdateAsync(Supplier supplier)
    {
        _dbContext.Suppliers.Update(supplier);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> ExistsByPhoneAsync(
        string phone,
        Guid? excludeSupplierId = null)
    {
        return await _dbContext.Suppliers.AnyAsync(s =>
            s.Phone == phone &&
            (!excludeSupplierId.HasValue || s.Id != excludeSupplierId.Value)
        );
    }
}