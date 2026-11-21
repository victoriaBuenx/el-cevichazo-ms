
using System.ComponentModel.DataAnnotations;
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Services.UseCases;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Services.UseCases;

public class UpdateServicesUseCaseTests
{
    private readonly Mock<IServicesRepository> _servicesRepository;
    private readonly Mock<ISuppliersRepository> _suppliersRepository;
    private readonly UpdateServiceUseCase _useCase;

    public UpdateServicesUseCaseTests()
    {
        _servicesRepository = new Mock<IServicesRepository>();
        _suppliersRepository = new Mock<ISuppliersRepository>();

        _useCase = new UpdateServiceUseCase(
            _servicesRepository.Object,
            _suppliersRepository.Object);
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
            ReminderEnabled = false,
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddDays(-10)
        };
    }

    private static UpdateServiceRequest CreateRequest()
    {
        return new UpdateServiceRequest
        {
            Name = "Internet actualizado",
            Description = "Nuevo plan de internet",
            Amount = 750,
            PaymentFrequency = PaymentFrequency.Monthly,
            NextDueDate = new DateOnly(2026, 12, 15),
            ReminderEnabled = true,
            ReminderDaysBefore = 5
        };
    }

    [Fact]
    public async Task ExecuteAsync_ShouldUpdateService_WhenRequestIsValid()
    {
        var service = CreateService();
        var request = CreateRequest();

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        var result = await _useCase.ExecuteAsync(service.Id, request);

        Assert.NotNull(result);
        Assert.Equal("Internet actualizado", result.Name);
        Assert.Equal("Nuevo plan de internet", result.Description);
        Assert.Equal(750, result.Amount);
        Assert.Equal(PaymentFrequency.Monthly, result.PaymentFrequency);
        Assert.Equal(new DateOnly(2026, 12, 15), result.NextDueDate);
        Assert.True(result.ReminderEnabled);
        Assert.Equal(5, result.ReminderDaysBefore);
        Assert.True(result.IsActive);

        Assert.True(result.UpdatedAt > service.CreatedAt);

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

        var result = await _useCase.ExecuteAsync(id, CreateRequest());

        Assert.Null(result);

        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenNameIsEmpty()
    {
        var service = CreateService();
        var request = CreateRequest();
        request.Name = " ";

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        Assert.Equal("El nombre del servicio es obligatorio.", exception.Message);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenAmountIsNegative()
    {
        // Arrange
        var service = CreateService();
        var request = CreateRequest();
        request.Amount = -100;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        // Act
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        // Assert
        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenFrequencyIsInvalid()
    {
        // Arrange
        var service = CreateService();
        var request = CreateRequest();
        request.PaymentFrequency = (PaymentFrequency)999;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        // Act
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        // Assert
        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenSupplierDoesNotExist()
    {
        // Arrange
        var service = CreateService();
        var request = CreateRequest();
        var supplierId = Guid.NewGuid();

        request.SupplierId = supplierId;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        _suppliersRepository
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync((Supplier?)null);

        // Act
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        // Assert
        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenSupplierIsInactive()
    {
        // Arrange
        var service = CreateService();
        var request = CreateRequest();
        var supplierId = Guid.NewGuid();

        request.SupplierId = supplierId;

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor inactivo",
            IsActive = false
        };

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        _suppliersRepository
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        // Act
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        // Assert
        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenReminderDaysAreMissing()
    {
        // Arrange
        var service = CreateService();
        var request = CreateRequest();
        request.ReminderEnabled = true;
        request.ReminderDaysBefore = null;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        // Act
        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(service.Id, request));

        // Assert
        _servicesRepository.Verify(
            r => r.UpdateAsync(It.IsAny<Service>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldClearReminderDays_WhenReminderIsDisabled()
    {
        // Arrange
        var service = CreateService();
        service.ReminderEnabled = true;
        service.ReminderDaysBefore = 5;

        var request = CreateRequest();
        request.ReminderEnabled = false;
        request.ReminderDaysBefore = 5;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        // Act
        var result = await _useCase.ExecuteAsync(service.Id, request);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.ReminderEnabled);
        Assert.Null(result.ReminderDaysBefore);

        _servicesRepository.Verify(
            r => r.UpdateAsync(service),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldPreserveActiveStatus_WhenUpdatingService()
    {
        // Arrange
        var service = CreateService();
        service.IsActive = false;

        _servicesRepository
            .Setup(r => r.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        // Act
        var result = await _useCase.ExecuteAsync(
            service.Id,
            CreateRequest());

        // Assert
        Assert.NotNull(result);
        Assert.False(result.IsActive);
    }
}
