using ElCevichazo.Application.Users.UseCases;
using ElCevichazo.Application.Users.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Application.Tests.Users;

public class GetUsersUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenUsersExist_ReturnsUserList()
    {
        var users = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid(),
                UserName = "Admin",
                Email = "admin@example.com",
                PasswordHash = "hashed-password",
                Role = UserRole.Admin,
                IsActive = true
            },
            new User
            {
                Id = Guid.NewGuid(),
                UserName = "Usuario",
                Email = "usuario@example.com",
                PasswordHash = "hashed-password",
                Role = UserRole.User,
                IsActive = true
            }
        };

        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(users);

        var useCase = new GetUsersUseCase(repository.Object);

        var result = await useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count);

        Assert.Equal("Admin", result[0].UserName);
        Assert.Equal("admin@example.com", result[0].Email);
        Assert.Equal("Admin", result[0].Role);

        Assert.Equal("Usuario", result[1].UserName);
        Assert.Equal("usuario@example.com", result[1].Email);
        Assert.Equal("User", result[1].Role);

        repository.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenNoUsersExist_ReturnsEmptyList()
    {
        var repository = new Mock<IUserRepository>();

        repository
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<User>());

        var useCase = new GetUsersUseCase(repository.Object);

        var result = await useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Empty(result);

        repository.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }
}