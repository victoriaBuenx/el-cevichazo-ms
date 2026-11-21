
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Services.UseCases;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Services.UseCases;

public class UpdateServicesStatusUseCaseTests
{
    private readonly Mock<IServicesRepository> _servicesRepository;
    private readonly UpdateServiceStatusUseCase _useCase;

    public UpdateServicesStatusUseCaseTests()
    {
        _servicesRepository = new Mock<IServicesRepository>();

        _useCase = new UpdateServiceStatusUseCase(
            _servicesRepository.Object);
    }

    private static Service CreateService()
    {
        return new Service
        {
            Id = Guid.NewGuid(),
            Name = "Internet",
            Description = "Servicio de internet",
            Amount = 650,
            PaymentFrequency = PaymentFrequency.Monthly,
            IsActive = true,
            ReminderEnabled = true,
            ReminderDaysBefore = 5,
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddDays(-5)
        };
    }

    [Fact]
    public async Task ExecuteAsync_ShouldDeactivateService_WhenIsActiveIsFalse()
    {
        var service = CreateService();

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        var request = new UpdateStatusRequest
        {
            IsActive = false
        };

        var result = await _useCase.ExecuteAsync(service.Id, request);

        Assert.NotNull(result);
        Assert.False(result.IsActive);

        _servicesRepository.Verify(
            r => r.UpdateAsync(service),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldActivateService_WhenIsActiveIsTrue()
    {
        var service = CreateService();
        service.IsActive = false;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        var request = new UpdateStatusRequest
        {
            IsActive = true
        };

        var result = await _useCase.ExecuteAsync(service.Id, request);

        Assert.NotNull(result);
        Assert.True(result.IsActive);

        _servicesRepository.Verify(
            r => r.UpdateAsync(service),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenServiceDoesNotExist()
    {
        var id = Guid.NewGuid();

        _servicesRepository
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync((Service?)null);

        var request = new UpdateStatusRequest
        {
            IsActive = false
        };

        var result = await _useCase.ExecuteAsync(id, request);

        Assert.Null(result);

        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldPreserveServiceInformation_WhenChangingStatus()
    {
        var service = CreateService();

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        var request = new UpdateStatusRequest
        {
            IsActive = false
        };

        var result = await _useCase.ExecuteAsync(service.Id, request);

        Assert.NotNull(result);
        Assert.Equal(service.Name, result.Name);
        Assert.Equal(service.Description, result.Description);
        Assert.Equal(service.Amount, result.Amount);
        Assert.Equal(service.PaymentFrequency, result.PaymentFrequency);
        Assert.Equal(service.ReminderEnabled, result.ReminderEnabled);
        Assert.Equal(service.ReminderDaysBefore, result.ReminderDaysBefore);
        Assert.Equal(service.CreatedAt, result.CreatedAt);
        Assert.False(result.IsActive);
    }
}
