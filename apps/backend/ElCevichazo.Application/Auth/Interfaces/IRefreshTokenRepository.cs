using ElCevichazo.Domain.Entities;
namespace ElCevichazo.Application.Auth.Interfaces;

public interface IRefreshTokenRepository
{
    Task AddRefreshTokenAsync(RefreshToken refreshToken);
}