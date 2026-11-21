
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace ElCevichazo.Infrastructure.Repositories;

public class ServicesRepository : IServicesRepository
{
    private readonly AppDbContext _dbContext;

    public ServicesRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Service>> GetAllAsync()
    {
        return await _dbContext.Services
            .AsNoTracking()
            .Include(s => s.Supplier)
            .OrderBy(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Service service)
    {
        await _dbContext.Services.AddAsync(service);
        await _dbContext.SaveChangesAsync();
    }
    public async Task<Service?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Services
            .Include(s => s.Supplier)
            .FirstOrDefaultAsync(s => s.Id == id);
    }
    public async Task UpdateAsync(Service service)
    {
        _dbContext.Services.Update(service);
        await _dbContext.SaveChangesAsync();
    }
}
