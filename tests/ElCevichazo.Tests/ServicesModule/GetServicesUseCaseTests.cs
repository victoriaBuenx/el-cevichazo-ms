
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Services.UseCases;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.Services.UseCases;

public class GetServicesUseCaseTests
{
    private readonly Mock<IServicesRepository> _servicesRepositoryMock;
    private readonly GetServicesUseCase _useCase;

    public GetServicesUseCaseTests()
    {
        _servicesRepositoryMock = new Mock<IServicesRepository>();

        _useCase = new GetServicesUseCase(
            _servicesRepositoryMock.Object
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnEmptyList_WhenNoServicesExist()
    {
        _servicesRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Service>());

        var result = await _useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Empty(result);

        _servicesRepositoryMock.Verify(
            r => r.GetAllAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnServices_WhenServicesExist()
    {
        var services = new List<Service>
        {
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Internet",
                Description = "Servicio de internet",
                Amount = 650m,
                PaymentFrequency = PaymentFrequency.Monthly,
                NextDueDate = new DateOnly(2026, 12, 1),
                IsActive = true,
                ReminderEnabled = true,
                ReminderDaysBefore = 5,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Id = Guid.NewGuid(),
                Name = "Spotify",
                Amount = 129m,
                PaymentFrequency = PaymentFrequency.Monthly,
                IsActive = true
            }
        };

        _servicesRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(services);

        var result = await _useCase.ExecuteAsync();

        Assert.Equal(2, result.Count);

        Assert.Equal("Internet", result[0].Name);
        Assert.Equal(650m, result[0].Amount);
        Assert.Equal(5, result[0].ReminderDaysBefore);

        Assert.Equal("Spotify", result[1].Name);
        Assert.Equal(129m, result[1].Amount);

        _servicesRepositoryMock.Verify(
            r => r.GetAllAsync(),
            Times.Once
        );
    }

    [Fact]
    public async Task ExecuteAsync_ShouldIncludeSupplierName_WhenServiceHasSupplier()
    {
        var service = new Service
        {
            Id = Guid.NewGuid(),
            Name = "Gas",
            SupplierId = Guid.NewGuid(),
            Supplier = new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "Gas Imperial"
            },
            PaymentFrequency = PaymentFrequency.Monthly
        };

        _servicesRepositoryMock
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Service> { service });

        var result = await _useCase.ExecuteAsync();

        Assert.Single(result);
        Assert.Equal("Gas Imperial", result[0].SupplierName);
    }
}
