using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace ElCevichazo.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;
    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
    public async Task AddAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _dbContext.Users
            .AsNoTracking()
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

    }

    public async Task UpdateAsync(User user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
    }
}