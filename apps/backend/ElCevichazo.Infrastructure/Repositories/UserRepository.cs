using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace ElCevichazo.Infrastructure.Repositories;

public class UserRespository : IUserRepository
{
    private readonly AppDbContext _dbContext;
    public UserRespository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}