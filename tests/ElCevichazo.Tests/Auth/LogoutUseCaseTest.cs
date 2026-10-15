using ElCevichazo.Application.Auth.DTOs;
using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Application.Auth.UseCases;
using Moq;

namespace ElCevichazo.Tests.Auth;

public class LogoutUseCaseTest
{
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepositoryMock = new();

    private LogoutUseCase CreateUseCase()
    {
        return new LogoutUseCase(_refreshTokenRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRevokeRefreshToken_WhenRefreshTokenIsProvided()
    {
        var request = new LogoutRequest { RefreshToken = "valid-refresh-token" };
        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(request);

        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeRefreshTokenAsync("valid-refresh-token"),
            Times.Once);
        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeByUserIdAsync(It.IsAny<Guid>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRevokeByUserId_WhenRefreshTokenIsNullButUserIdIsProvided()
    {
        var userId = Guid.NewGuid();
        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(null, userId);

        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeByUserIdAsync(userId),
            Times.Once);
        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeRefreshTokenAsync(It.IsAny<string>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldDoNothing_WhenNeitherTokenNorUserIdIsProvided()
    {
        var useCase = CreateUseCase();

        await useCase.ExecuteAsync(null, null);

        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeRefreshTokenAsync(It.IsAny<string>()),
            Times.Never);
        _refreshTokenRepositoryMock.Verify(
            repo => repo.RevokeByUserIdAsync(It.IsAny<Guid>()),
            Times.Never);
    }
}
