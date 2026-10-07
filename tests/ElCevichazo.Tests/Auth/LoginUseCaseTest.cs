using ElCevichazo.Application.Auth.DTOs;
using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Auth.UseCases;
using ElCevichazo.Application.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Auth;   

public class LoginUseCaseTest
{
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly Mock<IPasswordHasher> _passwordHasherMock = new();
    private readonly Mock<IJwtService> _jwtServiceMock = new();
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepositoryMock = new();
    public LoginUseCase CreateUseCase()
    {
        return new LoginUseCase(
            _userRepositoryMock.Object,
            _passwordHasherMock.Object,
            _jwtServiceMock.Object,
            _refreshTokenRepositoryMock.Object
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenUserNotFound()
    {
        var request = new LoginRequest
        {
            Email = "notfoundexample@example.com",
            Password = "password123"
        };

        _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(request);

        Assert.Null(result);
    }
    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenUserIsInactive()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "Test User",
            Email = "test@example.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = false
        };

        var request = new LoginRequest
        {
            Email = user.Email,
            Password = "Password123"
        };

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(user.Email))
            .ReturnsAsync(user);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.Null(result);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenPasswordIsIncorrect()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "Test User",
            Email = "test@example.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = true
        };

        var request = new LoginRequest
        {
            Email = user.Email,
            Password = "WrongPassword"
        };

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(user.Email))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(hasher => hasher.VerifyPassword(
                request.Password,
                user.PasswordHash))
            .Returns(false);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.Null(result);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnLoginResponse_WhenCredentialsAreValid()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "Test User",
            Email = "test@example.com",
            PasswordHash = "hashed-password",
            Role = UserRole.User,
            IsActive = true
        };

        var request = new LoginRequest
        {
            Email = user.Email,
            Password = "Password123"
        };

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(user.Email))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(hasher => hasher.VerifyPassword(
                request.Password,
                user.PasswordHash))
            .Returns(true);

        _jwtServiceMock
            .Setup(jwt => jwt.GenerateAccessToken(
                user.Id,
                user.Email,
                user.Role.ToString()))
            .Returns("access-token");

        _refreshTokenRepositoryMock
            .Setup(repository => repository.AddRefreshTokenAsync(
                It.IsAny<RefreshToken>()))
            .Returns(Task.CompletedTask);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal("access-token", result.AccessToken);
        Assert.NotEmpty(result.RefreshToken);
        Assert.Equal(user.Id, result.User.Id);
        Assert.Equal(user.Email, result.User.Email);
        Assert.Equal(user.Role.ToString(), result.User.Role);
    }
}