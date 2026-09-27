using System.ComponentModel;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using ElCevichazo.Application.Auth.Interfaces;

namespace ElCevichazo.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository (AppDbContext context){
        _context = context;
    }

    public async Task AddRefreshTokenAsync (RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
    }
}