using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Application.Suppliers.UseCases;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Tests.Suppliers;

public class RegisterSuppliersUseCaseTests
{
    private readonly Mock<ISuppliersRepository> _suppliersRepositoryMock = new();

    private RegisterSuppliersUseCase CreateUseCase()
    {
        return new RegisterSuppliersUseCase(_suppliersRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnNull_WhenPhoneAlreadyExists()
    {
        var request = new RegisterRequest
        {
            Name = "Pescadería Mar Azul",
            Phone = "1234567890",
            Notes = "Proveedor principal"
        };

        var existingSupplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = "Otro Proveedor",
            Phone = request.Phone,
            Notes = "Notas",
            IsActive = true
        };

        _suppliersRepositoryMock
            .Setup(repository => repository.GetByPhoneAsync(request.Phone))
            .ReturnsAsync(existingSupplier);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.Null(result);

        _suppliersRepositoryMock.Verify(
            repository => repository.AddAsync(It.IsAny<Supplier>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldCreateSupplier_WhenPhoneDoesNotExist()
    {
        var request = new RegisterRequest
        {
            Name = "Pescadería Mar Azul",
            Phone = "1234567890",
            Notes = "Proveedor principal"
        };

        _suppliersRepositoryMock
            .Setup(repository => repository.GetByPhoneAsync(request.Phone))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);

        _suppliersRepositoryMock.Verify(
            repository => repository.AddAsync(It.Is<Supplier>(supplier =>
                supplier.Name == request.Name &&
                supplier.Phone == request.Phone &&
                supplier.Notes == request.Notes &&
                supplier.IsActive
            )),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnSupplierInformation_WhenRegistrationIsSuccessful()
    {
        var request = new RegisterRequest
        {
            Name = "Pescadería Mar Azul",
            Phone = "1234567890",
            Notes = "Proveedor principal"
        };

        _suppliersRepositoryMock
            .Setup(repository => repository.GetByPhoneAsync(request.Phone))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(request.Name, result.Name);
        Assert.Equal(request.Phone, result.Phone);
        Assert.Equal(request.Notes, result.Notes);
        Assert.True(result.IsActive);
        Assert.NotEqual(default(DateTime), result.CreatedAt);
        Assert.NotEqual(default(DateTime), result.UpdatedAt);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldTrimInputData_WhenRegisteringSupplier()
    {
        var request = new RegisterRequest
        {
            Name = "  Pescadería Mar Azul  ",
            Phone = "  1234567890  ",
            Notes = "  Notas con espacio  "
        };

        _suppliersRepositoryMock
            .Setup(repository => repository.GetByPhoneAsync("1234567890"))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal("Pescadería Mar Azul", result.Name);
        Assert.Equal("1234567890", result.Phone);
        Assert.Equal("Notas con espacio", result.Notes);

        _suppliersRepositoryMock.Verify(
            repository => repository.AddAsync(It.Is<Supplier>(s =>
                s.Name == "Pescadería Mar Azul" &&
                s.Phone == "1234567890" &&
                s.Notes == "Notas con espacio"
            )),
            Times.Once);
    }
}
