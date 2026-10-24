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
}