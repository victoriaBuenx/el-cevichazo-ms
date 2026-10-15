using ElCevichazo.Application.Auth.DTOs;
using ElCevichazo.Application.Auth.Interfaces;

namespace ElCevichazo.Application.Auth.UseCases;

public class LogoutUseCase
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public LogoutUseCase(IRefreshTokenRepository refreshTokenRepository)
    {
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task ExecuteAsync(LogoutRequest? request, Guid? userId = null)
    {
        if (!string.IsNullOrWhiteSpace(request?.RefreshToken))
        {
            await _refreshTokenRepository.RevokeRefreshTokenAsync(request.RefreshToken);
        }
        else if (userId.HasValue && userId.Value != Guid.Empty)
        {
            await _refreshTokenRepository.RevokeByUserIdAsync(userId.Value);
        }
    }
}
