using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Application.Suppliers.UseCases;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Tests.Suppliers;

public class UpdateSupplierStatusUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_WhenSupplierExists_DeactivatesSupplier()
    {
        var supplierId = Guid.NewGuid();
        var initialUpdatedAt = DateTime.UtcNow.AddHours(-1);

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor",
            Phone = "1234567890",
            IsActive = true,
            CreatedAt = initialUpdatedAt,
            UpdatedAt = initialUpdatedAt
        };

        var request = new UpdateSupplierStatusRequest
        {
            IsActive = false
        };

        var repository = new Mock<ISuppliersRepository>();

        repository
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        var useCase = new UpdateSupplierStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.False(supplier.IsActive);
        Assert.True(supplier.UpdatedAt > initialUpdatedAt);

        repository.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenSupplierExists_ActivatesSupplier()
    {
        var supplierId = Guid.NewGuid();
        var initialUpdatedAt = DateTime.UtcNow.AddHours(-1);

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor",
            Phone = "1234567890",
            IsActive = false,
            CreatedAt = initialUpdatedAt,
            UpdatedAt = initialUpdatedAt
        };

        var request = new UpdateSupplierStatusRequest
        {
            IsActive = true
        };

        var repository = new Mock<ISuppliersRepository>();

        repository
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        var useCase = new UpdateSupplierStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.True(supplier.IsActive);
        Assert.True(supplier.UpdatedAt > initialUpdatedAt);

        repository.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenSupplierDoesNotExist_ReturnsFalse()
    {
        var supplierId = Guid.NewGuid();

        var request = new UpdateSupplierStatusRequest
        {
            IsActive = false
        };

        var repository = new Mock<ISuppliersRepository>();

        repository
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync((Supplier?)null);

        var useCase = new UpdateSupplierStatusUseCase(repository.Object);

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.False(result);

        repository.Verify(
            r => r.UpdateAsync(It.IsAny<Supplier>()),
            Times.Never);
    }
}
