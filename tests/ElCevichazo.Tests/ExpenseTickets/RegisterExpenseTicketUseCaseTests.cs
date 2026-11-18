using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Exceptions;
using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.ExpenseTickets.UseCases;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.ExpenseTickets;

public class RegisterExpenseTicketUseCaseTests
{
    private readonly Mock<IExpenseTicketRepository> _expenseTicketRepositoryMock = new();
    private readonly Mock<ISuppliersRepository> _suppliersRepositoryMock = new();

    private RegisterExpenseTicketUseCase CreateUseCase()
    {
        return new RegisterExpenseTicketUseCase(
            _expenseTicketRepositoryMock.Object,
            _suppliersRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowSupplierNotFoundException_WhenSupplierDoesNotExist()
    {
        var supplierId = Guid.NewGuid();
        var request = new RegisterExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra de mariscos",
            Amount = 1500.50m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(supplierId))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        await Assert.ThrowsAsync<SupplierNotFoundException>(() => useCase.ExecuteAsync(request));

        _expenseTicketRepositoryMock.Verify(
            repo => repo.AddAsync(It.IsAny<ExpenseTicket>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowInvalidOperationException_WhenSupplierIsInactive()
    {
        var supplierId = Guid.NewGuid();
        var inactiveSupplier = new Supplier
        {
            Id = supplierId,
            Name = "Proveedor Inactivo",
            Phone = "1234567890",
            IsActive = false
        };

        var request = new RegisterExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra de mariscos",
            Amount = 1500.50m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(supplierId))
            .ReturnsAsync(inactiveSupplier);

        var useCase = CreateUseCase();

        await Assert.ThrowsAsync<InvalidOperationException>(() => useCase.ExecuteAsync(request));

        _expenseTicketRepositoryMock.Verify(
            repo => repo.AddAsync(It.IsAny<ExpenseTicket>()),
            Times.Never);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-50)]
    public async Task ExecuteAsync_ShouldThrowArgumentException_WhenAmountIsZeroOrNegative(decimal invalidAmount)
    {
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Pescadería El Puerto",
            Phone = "1234567890",
            IsActive = true
        };

        var request = new RegisterExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra de mariscos",
            Amount = invalidAmount,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        var useCase = CreateUseCase();

        await Assert.ThrowsAsync<ArgumentException>(() => useCase.ExecuteAsync(request));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldCreateTicketAndReturnResponse_WhenDataIsValidAndPaid()
    {
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Pescadería El Puerto",
            Phone = "1234567890",
            IsActive = true
        };

        var request = new RegisterExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = new DateTime(2026, 3, 24, 12, 0, 0, DateTimeKind.Utc),
            Description = "  Compra de camarón y pulpo  ",
            Amount = 2450.75m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid,
            Notes = "  Fondo de caja chica  ",
            VoucherUrl = "https://bucket.com/ticket1.jpg",
            VoucherOriginalName = "nota_123.jpg"
        };

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(supplierId, result.SupplierId);
        Assert.Equal("Pescadería El Puerto", result.SupplierName);
        Assert.Equal("Compra de camarón y pulpo", result.Description);
        Assert.Equal(2450.75m, result.Amount);
        Assert.Equal(PaymentMethod.Cash, result.PaymentMethod);
        Assert.Equal(PaymentStatus.Paid, result.PaymentStatus);
        Assert.Equal("Fondo de caja chica", result.Notes);
        Assert.NotNull(result.PaidAt);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.AddAsync(It.Is<ExpenseTicket>(t =>
                t.SupplierId == supplierId &&
                t.Description == "Compra de camarón y pulpo" &&
                t.Amount == 2450.75m &&
                t.PaymentMethod == PaymentMethod.Cash &&
                t.PaymentStatus == PaymentStatus.Paid &&
                t.PaidAt != null
            )),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldSetPaidAtToNull_WhenPaymentStatusIsPending()
    {
        var supplierId = Guid.NewGuid();
        var supplier = new Supplier
        {
            Id = supplierId,
            Name = "Carnicería San Juan",
            Phone = "1234567890",
            IsActive = true
        };

        var request = new RegisterExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Pedido para fin de semana",
            Amount = 4800.00m,
            PaymentMethod = PaymentMethod.Transfer,
            PaymentStatus = PaymentStatus.Pending
        };

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(supplierId))
            .ReturnsAsync(supplier);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(request);

        Assert.NotNull(result);
        Assert.Equal(PaymentStatus.Pending, result.PaymentStatus);
        Assert.Null(result.PaidAt);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.AddAsync(It.Is<ExpenseTicket>(t =>
                t.PaymentStatus == PaymentStatus.Pending &&
                t.PaidAt == null
            )),
            Times.Once);
    }
}
