using ElCevichazo.Application.Suppliers.UseCases;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Tests.Suppliers;

public class GetSuppliersUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenSuppliersExist_ReturnsSupplierList()
    {
        var suppliers = new List<Supplier>
        {
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "Distribuidora de Mariscos",
                Phone = "1234567890",
                Notes = "Entrega los martes",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "Verduras del Valle",
                Phone = "0987654321",
                Notes = "Entrega diaria",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        var repository = new Mock<ISuppliersRepository>();

        repository
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(suppliers);

        var useCase = new GetSuppliersUseCase(repository.Object);

        var result = await useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count);

        Assert.Equal(suppliers[0].Id, result[0].Id);
        Assert.Equal("Distribuidora de Mariscos", result[0].Name);
        Assert.Equal("1234567890", result[0].Phone);
        Assert.Equal("Entrega los martes", result[0].Notes);
        Assert.True(result[0].IsActive);

        Assert.Equal(suppliers[1].Id, result[1].Id);
        Assert.Equal("Verduras del Valle", result[1].Name);
        Assert.Equal("0987654321", result[1].Phone);
        Assert.Equal("Entrega diaria", result[1].Notes);
        Assert.True(result[1].IsActive);

        repository.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenNoSuppliersExist_ReturnsEmptyList()
    {
        var repository = new Mock<ISuppliersRepository>();

        repository
            .Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<Supplier>());

        var useCase = new GetSuppliersUseCase(repository.Object);

        var result = await useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Empty(result);

        repository.Verify(
            r => r.GetAllAsync(),
            Times.Once);
    }
}
