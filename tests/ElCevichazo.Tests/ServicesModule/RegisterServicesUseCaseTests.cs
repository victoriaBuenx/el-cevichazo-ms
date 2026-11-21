
using System.ComponentModel.DataAnnotations;
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Services.UseCases;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Services.UseCases;

public class RegisterUseCaseTests
{
    private readonly Mock<IServicesRepository> _servicesRepositoryMock;
    private readonly Mock<ISuppliersRepository> _suppliersRepositoryMock;
    private readonly RegisterServicesUseCase _useCase;

    public RegisterUseCaseTests()
    {
        _servicesRepositoryMock = new Mock<IServicesRepository>();
        _suppliersRepositoryMock = new Mock<ISuppliersRepository>();

        _useCase = new RegisterServicesUseCase(
            _servicesRepositoryMock.Object,
            _suppliersRepositoryMock.Object
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRegisterService_WhenRequestIsValid()
    {
        var request = new RegisterRequest
        {
            Name = "Internet",
            Description = "Servicio de internet",
            Amount = 650m,
            PaymentFrequency = PaymentFrequency.Monthly,
            NextDueDate = new DateOnly(2026, 12, 1),
            ReminderEnabled = true,
            ReminderDaysBefore = 5
        };

        Service? savedService = null;

        _servicesRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Service>()))
            .Callback<Service>(s => savedService = s)
            .Returns(Task.CompletedTask);

        var result = await _useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal("Internet", result.Name);
        Assert.Equal(650m, result.Amount);
        Assert.True(result.IsActive);
        Assert.True(result.ReminderEnabled);
        Assert.Equal(5, result.ReminderDaysBefore);

        Assert.NotNull(savedService);
        Assert.NotEqual(Guid.Empty, savedService.Id);

        _servicesRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Service>()),
            Times.Once
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRegisterServiceWithoutSupplier_WhenSupplierIdIsNull()
    {
        var request = new RegisterRequest
        {
            Name = "Spotify",
            Amount = 129m,
            PaymentFrequency = PaymentFrequency.Monthly
        };

        _servicesRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Service>()))
            .Returns(Task.CompletedTask);

        var result = await _useCase.ExecuteAsync(request);
        Assert.Null(result.SupplierId);

        _suppliersRepositoryMock.Verify(
            r => r.GetByIdAsync(It.IsAny<Guid>()),
            Times.Never
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRegisterService_WhenSupplierIsActive()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Gas Imperial",
            IsActive = true
        };

        var request = new RegisterRequest
        {
            Name = "Gas",
            SupplierId = supplierId,
            PaymentFrequency = PaymentFrequency.Monthly
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _servicesRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Service>()))
            .Returns(Task.CompletedTask);

        var result = await _useCase.ExecuteAsync(request);

        Assert.Equal(supplierId, result.SupplierId);

        _servicesRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Service>()),
            Times.Once
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenNameIsEmpty()
    {
        var request = new RegisterRequest
        {
            Name = "   ",
            PaymentFrequency = PaymentFrequency.Monthly
        };

        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(request)
        );

        _servicesRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Service>()),
            Times.Never
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenAmountIsNegative()
    {
        var request = new RegisterRequest
        {
            Name = "Internet",
            Amount = -100m,
            PaymentFrequency = PaymentFrequency.Monthly
        };

        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(request)
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenSupplierDoesNotExist()
    {
        var supplierId = Guid.NewGuid();

        var request = new RegisterRequest
        {
            Name = "Gas",
            SupplierId = supplierId,
            PaymentFrequency = PaymentFrequency.Monthly
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync((Supplier?)null);

        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(request)
        );

        _servicesRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Service>()),
            Times.Never
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenSupplierIsInactive()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor inactivo",
            IsActive = false
        };

        var request = new RegisterRequest
        {
            Name = "Gas",
            SupplierId = supplierId,
            PaymentFrequency = PaymentFrequency.Monthly
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(request)
        );

        _servicesRepositoryMock.Verify(
            r => r.AddAsync(It.IsAny<Service>()),
            Times.Never
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowValidationException_WhenReminderDaysAreMissing()
    {
        var request = new RegisterRequest
        {
            Name = "Internet",
            PaymentFrequency = PaymentFrequency.Monthly,
            ReminderEnabled = true,
            ReminderDaysBefore = null
        };

        await Assert.ThrowsAsync<ValidationException>(
            () => _useCase.ExecuteAsync(request)
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldSetReminderDaysToNull_WhenReminderIsDisabled()
    {
        var request = new RegisterRequest
        {
            Name = "Spotify",
            PaymentFrequency = PaymentFrequency.Monthly,
            ReminderEnabled = false,
            ReminderDaysBefore = 5
        };

        Service? savedService = null;

        _servicesRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Service>()))
            .Callback<Service>(s => savedService = s)
            .Returns(Task.CompletedTask);

        await _useCase.ExecuteAsync(request);

        Assert.NotNull(savedService);
        Assert.False(savedService.ReminderEnabled);
        Assert.Null(savedService.ReminderDaysBefore);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldRegisterService_WhenFrequencyIsOneTime()
    {
        var request = new RegisterRequest
        {
            Name = "Mantenimiento especial",
            PaymentFrequency = PaymentFrequency.OneTime
        };

        _servicesRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Service>()))
            .Returns(Task.CompletedTask);

        var result = await _useCase.ExecuteAsync(request);

        Assert.Equal(PaymentFrequency.OneTime, result.PaymentFrequency);
    }
}
