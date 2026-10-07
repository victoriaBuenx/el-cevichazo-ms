using ElCevichazo.Application.Auth.DTOs;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Application.Interfaces;
using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Auth.UseCases;

public class LoginUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public LoginUseCase (IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _refreshTokenRepository = refreshTokenRepository;
    }
    public async Task<LoginResponse?> ExecuteAsync(LoginRequest resquest)
    {
        var user = await _userRepository.GetByEmailAsync(resquest.Email);

        if (user is null)
            return null;

        if (!user.IsActive)
            return null;

        var passwordIsValid = _passwordHasher.VerifyPassword(
            resquest.Password,
            user.PasswordHash
        );

        if (!passwordIsValid)
            return null;

        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.Email, user.Role.ToString());
        
        var refreshTokenValue = Guid.NewGuid().ToString();
        var expiresAt = DateTime.UtcNow.AddDays(7);

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false,
        };

        await _refreshTokenRepository.AddRefreshTokenAsync(refreshToken);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            Expiration = expiresAt,
            User = new UserAuthResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Role = user.Role.ToString()
            }
        };  
    }
    
}
