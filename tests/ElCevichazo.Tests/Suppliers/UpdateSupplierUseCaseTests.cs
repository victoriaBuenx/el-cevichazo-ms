using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Exceptions;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Application.Suppliers.UseCases;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Tests.Suppliers;

public class UpdateSupplierUseCaseTests
{
    private readonly Mock<ISuppliersRepository> _suppliersRepositoryMock = new();

    private UpdateSupplierUseCase CreateUseCase()
    {
        return new UpdateSupplierUseCase(_suppliersRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WhenSupplierExists_UpdatesSupplier()
    {
        var supplierId = Guid.NewGuid();
        var initialUpdatedAt = DateTime.UtcNow.AddHours(-1);

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor Original",
            Phone = "1111111111",
            Notes = "Notas originales",
            IsActive = true,
            CreatedAt = initialUpdatedAt,
            UpdatedAt = initialUpdatedAt
        };

        var request = new UpdateSupplierRequest
        {
            Name = "Proveedor Actualizado",
            Phone = "2222222222",
            Notes = "Notas actualizadas"
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _suppliersRepositoryMock
            .Setup(r => r.ExistsByPhoneAsync(request.Phone, supplierId))
            .ReturnsAsync(false);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.Equal("Proveedor Actualizado", supplier.Name);
        Assert.Equal("2222222222", supplier.Phone);
        Assert.Equal("Notas actualizadas", supplier.Notes);
        Assert.True(supplier.UpdatedAt > initialUpdatedAt);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenSupplierDoesNotExist_ReturnsFalse()
    {
        var supplierId = Guid.NewGuid();

        var request = new UpdateSupplierRequest
        {
            Name = "Proveedor Actualizado",
            Phone = "2222222222",
            Notes = "Notas actualizadas"
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.False(result);

        _suppliersRepositoryMock.Verify(
            r => r.ExistsByPhoneAsync(It.IsAny<string>(), It.IsAny<Guid?>()),
            Times.Never);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<Supplier>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_WhenPhoneAlreadyExistsForAnotherSupplier_ThrowsDuplicateSupplierPhoneException()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor Original",
            Phone = "1111111111",
            Notes = "Notas originales",
            IsActive = true
        };

        var request = new UpdateSupplierRequest
        {
            Name = "Proveedor Con Teléfono Duplicado",
            Phone = "3333333333",
            Notes = "Notas"
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _suppliersRepositoryMock
            .Setup(r => r.ExistsByPhoneAsync(request.Phone, supplierId))
            .ReturnsAsync(true);

        var useCase = CreateUseCase();

        var exception = await Assert.ThrowsAsync<DuplicateSupplierPhoneException>(() =>
            useCase.ExecuteAsync(supplierId, request));

        Assert.Equal("El número de teléfono ya está registrado.", exception.Message);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<Supplier>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_WhenPhoneIsUnchangedForSameSupplier_UpdatesSupplierSuccessfully()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor Mismo Teléfono",
            Phone = "1234567890",
            Notes = "Notas previas",
            IsActive = true
        };

        var request = new UpdateSupplierRequest
        {
            Name = "Proveedor Nombre Cambiado",
            Phone = "1234567890",
            Notes = "Nuevas notas"
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _suppliersRepositoryMock
            .Setup(r => r.ExistsByPhoneAsync("1234567890", supplierId))
            .ReturnsAsync(false);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.Equal("Proveedor Nombre Cambiado", supplier.Name);
        Assert.Equal("1234567890", supplier.Phone);
        Assert.Equal("Nuevas notas", supplier.Notes);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldTrimInputData_WhenUpdatingSupplier()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Original",
            Phone = "1111111111",
            IsActive = true
        };

        var request = new UpdateSupplierRequest
        {
            Name = "  Proveedor Con Espacios  ",
            Phone = "  2222222222  ",
            Notes = "  Notas con espacios  "
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _suppliersRepositoryMock
            .Setup(r => r.ExistsByPhoneAsync("2222222222", supplierId))
            .ReturnsAsync(false);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.Equal("Proveedor Con Espacios", supplier.Name);
        Assert.Equal("2222222222", supplier.Phone);
        Assert.Equal("Notas con espacios", supplier.Notes);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenNotesAreNull_UpdatesSupplierSuccessfully()
    {
        var supplierId = Guid.NewGuid();

        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Original",
            Phone = "1111111111",
            Notes = "Tiene notas",
            IsActive = true
        };

        var request = new UpdateSupplierRequest
        {
            Name = "Nombre Actualizado",
            Phone = "1111111111",
            Notes = null
        };

        _suppliersRepositoryMock
            .Setup(r => r.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        _suppliersRepositoryMock
            .Setup(r => r.ExistsByPhoneAsync("1111111111", supplierId))
            .ReturnsAsync(false);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(supplierId, request);

        Assert.True(result);
        Assert.Equal("Nombre Actualizado", supplier.Name);
        Assert.Null(supplier.Notes);

        _suppliersRepositoryMock.Verify(
            r => r.UpdateAsync(supplier),
            Times.Once);
    }
}
