using Microsoft.EntityFrameworkCore;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using ElCevichazo.Application.Auth.Interfaces;

namespace ElCevichazo.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddRefreshTokenAsync(RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
    }

    public async Task RevokeRefreshTokenAsync(string token)
    {
        var existingToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);

        if (existingToken is not null)
        {
            existingToken.IsRevoked = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RevokeByUserIdAsync(Guid userId)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync();

        if (activeTokens.Count > 0)
        {
            foreach (var token in activeTokens)
            {
                token.IsRevoked = true;
            }
            await _context.SaveChangesAsync();
        }
    }
}