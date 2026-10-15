using ElCevichazo.Domain.Entities;
namespace ElCevichazo.Application.Auth.Interfaces;

public interface IRefreshTokenRepository
{
    Task AddRefreshTokenAsync(RefreshToken refreshToken);
    Task RevokeRefreshTokenAsync(string token);
    Task RevokeByUserIdAsync(Guid userId);
}