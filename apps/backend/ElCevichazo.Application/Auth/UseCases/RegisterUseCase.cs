using ElCevichazo.Application.Auth.DTOs;
using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Application.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;


namespace ElCevichazo.Application.Auth.UseCases;

public class RegisterUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHaser;

    public RegisterUseCase(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHaser = passwordHasher;
    }

    public async Task<RegisterResponse?> ExecuteAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser is not null)
            return null;    
        
        var passwordHash = _passwordHaser.HashPassword(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = request.UserName,
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = UserRole.User,
            IsActive = true
        };

        await _userRepository.AddAsync(user);

        return new RegisterResponse
        {
            User = new UserAuthResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };
    }
}