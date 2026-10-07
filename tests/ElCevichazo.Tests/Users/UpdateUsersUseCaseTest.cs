using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Application.Users.UseCases;
using ElCevichazo.Application.Users.DTOs;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Application.Tests.Users;

public class UpdateUserUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenUserExists_UpdatesUser()
    {
        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            UserName = "Usuario Original",
            Email = "original@example.com",
            PasswordHash = "hashed-password",
            IsActive = true
        };

        var request = new UpdateUserRequest
        {
            UserName = "Usuario Actualizado",
            Email = "actualizado@example.com"
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);

        var useCase = new UpdateUserUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(userId, request);

        Assert.True(result);
        Assert.Equal("Usuario Actualizado", user.UserName);
        Assert.Equal("actualizado@example.com", user.Email);

        repository.Verify(
            r => r.UpdateAsync(user),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenUserDoesNotExist_ReturnsFalse()
    {
        var userId = Guid.NewGuid();

        var request = new UpdateUserRequest
        {
            UserName = "Usuario Actualizado",
            Email = "actualizado@example.com"
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        var useCase = new UpdateUserUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(userId, request);

        Assert.False(result);

        repository.Verify(
            r => r.UpdateAsync(It.IsAny<User>()),
            Times.Never);
    }
}