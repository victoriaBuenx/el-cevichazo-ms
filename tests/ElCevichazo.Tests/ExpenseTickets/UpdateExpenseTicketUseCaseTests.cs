using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Exceptions;
using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.ExpenseTickets.UseCases;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.ExpenseTickets;

public class UpdateExpenseTicketUseCaseTests
{
    private readonly Mock<IExpenseTicketRepository> _expenseTicketRepositoryMock = new();
    private readonly Mock<ISuppliersRepository> _suppliersRepositoryMock = new();

    private UpdateExpenseTicketUseCase CreateUseCase()
    {
        return new UpdateExpenseTicketUseCase(
            _expenseTicketRepositoryMock.Object,
            _suppliersRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnFalse_WhenTicketDoesNotExist()
    {
        var ticketId = Guid.NewGuid();
        var request = new UpdateExpenseTicketRequest
        {
            SupplierId = Guid.NewGuid(),
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra",
            Amount = 100m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync((ExpenseTicket?)null);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(ticketId, request);

        Assert.False(result);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowSupplierNotFoundException_WhenChangingToNonExistentSupplier()
    {
        var ticketId = Guid.NewGuid();
        var oldSupplierId = Guid.NewGuid();
        var newSupplierId = Guid.NewGuid();

        var ticket = new ExpenseTicket
        {
            Id = ticketId,
            SupplierId = oldSupplierId,
            Description = "Nota original",
            Amount = 200m
        };

        var request = new UpdateExpenseTicketRequest
        {
            SupplierId = newSupplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Nota actualizada",
            Amount = 300m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        _suppliersRepositoryMock
            .Setup(repo => repo.GetByIdAsync(newSupplierId))
            .ReturnsAsync((Supplier?)null);

        var useCase = CreateUseCase();

        await Assert.ThrowsAsync<SupplierNotFoundException>(() => useCase.ExecuteAsync(ticketId, request));
    }

    [Fact]
    public async Task ExecuteAsync_ShouldUpdateTicketAndSetPaidAt_WhenStatusChangesToPaid()
    {
        var ticketId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();

        var ticket = new ExpenseTicket
        {
            Id = ticketId,
            SupplierId = supplierId,
            Description = "Nota previa",
            Amount = 500m,
            PaymentMethod = PaymentMethod.Transfer,
            PaymentStatus = PaymentStatus.Pending,
            PaidAt = null
        };

        var request = new UpdateExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Nota liquidada por transferencia",
            Amount = 550m,
            PaymentMethod = PaymentMethod.Transfer,
            PaymentStatus = PaymentStatus.Paid
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(ticketId, request);

        Assert.True(result);
        Assert.Equal("Nota liquidada por transferencia", ticket.Description);
        Assert.Equal(550m, ticket.Amount);
        Assert.Equal(PaymentStatus.Paid, ticket.PaymentStatus);
        Assert.NotNull(ticket.PaidAt);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.UpdateAsync(ticket),
            Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldSetPaidAtToNull_WhenStatusChangesToPending()
    {
        var ticketId = Guid.NewGuid();
        var supplierId = Guid.NewGuid();

        var ticket = new ExpenseTicket
        {
            Id = ticketId,
            SupplierId = supplierId,
            Description = "Nota pagada",
            Amount = 500m,
            PaymentMethod = PaymentMethod.Transfer,
            PaymentStatus = PaymentStatus.Paid,
            PaidAt = DateTime.UtcNow.AddDays(-1)
        };

        var request = new UpdateExpenseTicketRequest
        {
            SupplierId = supplierId,
            ExpenseDate = DateTime.UtcNow,
            Description = "Nota pendiente",
            Amount = 500m,
            PaymentMethod = PaymentMethod.Transfer,
            PaymentStatus = PaymentStatus.Pending
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(ticketId, request);

        Assert.True(result);
        Assert.Equal(PaymentStatus.Pending, ticket.PaymentStatus);
        Assert.Null(ticket.PaidAt);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.UpdateAsync(ticket),
            Times.Once);
    }
}
