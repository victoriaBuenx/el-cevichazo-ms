using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Users.UseCases;
using ElCevichazo.Application.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Users;

public class RegisterUseCaseTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly Mock<IPasswordHasher> _passwordHasherMock = new();

    private RegisterUseCase CreateUseCase()
    {
        return new RegisterUseCase(
            _userRepositoryMock.Object,
            _passwordHasherMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenEmailAlreadyExists()
    {
        var request = new RegisterRequest
        {
            UserName = "Victoria",
            Email = "victoria@example.com",
            Password = "Password123"
        };

        var existingUser = new User
        {
            Id = Guid.NewGuid(),
            UserName = "AnotherUser",
            Email = request.Email,
            PasswordHash = "existing-hash",
            Role = UserRole.User,
            IsActive = true
        };

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(request.Email))
            .ReturnsAsync(existingUser);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.Null(result);

        _passwordHasherMock.Verify(
            hasher => hasher.HashPassword(It.IsAny<string>()),
            Times.Never);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(It.IsAny<User>()),
            Times.Never);
    }
    [Fact]
    public async Task ExecuteAsync_ShouldCreateUser_WhenEmailDoesNotExist()
    {
        var request = new RegisterRequest
        {
            UserName = "Victoria",
            Email = "victoria@example.com",
            Password = "Password123"
        };

        const string passwordHash = "hashed-password";

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(hasher => hasher.HashPassword(request.Password))
            .Returns(passwordHash);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(It.Is<User>(user =>
                user.UserName == request.UserName &&
                user.Email == request.Email &&
                user.PasswordHash == passwordHash
            )),
            Times.Once);
    }
    [Fact]
    public async Task ExecuteAsync_ShouldHashPassword_WhenRegisteringUser()
    {
        var request = new RegisterRequest
        {
            UserName = "Victoria",
            Email = "victoria@example.com",
            Password = "Password123"
        };

        const string passwordHash = "hashed-password";

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(hasher => hasher.HashPassword(request.Password))
            .Returns(passwordHash);

        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(request);

        _passwordHasherMock.Verify(
            hasher => hasher.HashPassword(request.Password),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldAssignUserRoleAndActivateUser()
    {
        var request = new RegisterRequest
        {
            UserName = "Victoria",
            Email = "victoria@example.com",
            Password = "Password123"
        };

        const string passwordHash = "hashed-password";

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(hasher => hasher.HashPassword(request.Password))
            .Returns(passwordHash);

        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(request);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(It.Is<User>(user =>
                user.Role == UserRole.User &&
                user.IsActive
            )),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnUserInformation_WhenRegistrationIsSuccessful()
    {
        var request = new RegisterRequest
        {
            UserName = "Victoria",
            Email = "victoria@example.com",
            Password = "Password123"
        };

        const string passwordHash = "hashed-password";

        _userRepositoryMock
            .Setup(repository => repository.GetByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(hasher => hasher.HashPassword(request.Password))
            .Returns(passwordHash);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.NotNull(result.User);

        Assert.Equal(request.UserName, result.User.UserName);
        Assert.Equal(request.Email, result.User.Email);
        Assert.Equal(UserRole.User.ToString(), result.User.Role);
        Assert.NotEqual(Guid.Empty, result.User.Id);
    }
}