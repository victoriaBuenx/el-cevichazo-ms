using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Users.UseCases;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Application.Tests.Users;

public class UpdateUserStatusUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenUserExists_DeactivatesUser()
    {
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            UserName = "Usuario",
            Email = "usuario@example.com",
            PasswordHash = "hashed-password",
            IsActive = true
        };

        var request = new UpdateUserStatusRequest
        {
            IsActive = false
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        var useCase = new UpdateUserStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(userId, request);

        Assert.True(result);
        Assert.False(user.IsActive);

        repository.Verify(
            r => r.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserExists_ActivatesUser()
    {
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            UserName = "Usuario",
            Email = "usuario@example.com",
            PasswordHash = "hashed-password",
            IsActive = false
        };

        var request = new UpdateUserStatusRequest
        {
            IsActive = true
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        var useCase = new UpdateUserStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(userId, request);

        Assert.True(result);
        Assert.True(user.IsActive);

        repository.Verify(
            r => r.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ReturnsFalse()
    {
        var userId = Guid.NewGuid();

        var request = new UpdateUserStatusRequest
        {
            IsActive = false
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        var useCase = new UpdateUserStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(userId, request);

        Assert.False(result);

        repository.Verify(
            r => r.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }
}