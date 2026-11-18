using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.ExpenseTickets.UseCases;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;
using Moq;

namespace ElCevichazo.Tests.ExpenseTickets;

public class GetExpenseTicketsUseCaseTests
{
    private readonly Mock<IExpenseTicketRepository> _expenseTicketRepositoryMock = new();

    private GetExpenseTicketsUseCase CreateUseCase()
    {
        return new GetExpenseTicketsUseCase(_expenseTicketRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnListOfTicketsWithSupplierData()
    {
        var supplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = "Pescadería Mar Azul",
            Phone = "9988776655",
            IsActive = true
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = "cajero1",
            Email = "cajero1@elcevichazo.com"
        };

        var ticket = new ExpenseTicket
        {
            Id = Guid.NewGuid(),
            SupplierId = supplier.Id,
            Supplier = supplier,
            RegisteredByUserId = user.Id,
            RegisteredByUser = user,
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra de mariscos",
            Amount = 1850.00m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetAllAsync())
            .ReturnsAsync(new List<ExpenseTicket> { ticket });

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync();

        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal(ticket.Id, result[0].Id);
        Assert.Equal(supplier.Id, result[0].SupplierId);
        Assert.Equal("Pescadería Mar Azul", result[0].SupplierName);
        Assert.Equal("9988776655", result[0].SupplierPhone);
        Assert.Equal("cajero1", result[0].RegisteredByUserName);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnTicket_WhenExists()
    {
        var ticketId = Guid.NewGuid();
        var supplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = "Pescadería Mar Azul",
            Phone = "9988776655"
        };

        var ticket = new ExpenseTicket
        {
            Id = ticketId,
            SupplierId = supplier.Id,
            Supplier = supplier,
            ExpenseDate = DateTime.UtcNow,
            Description = "Compra de hielo",
            Amount = 350.00m,
            PaymentMethod = PaymentMethod.Cash,
            PaymentStatus = PaymentStatus.Paid
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        var useCase = CreateUseCase();
        var result = await useCase.GetByIdAsync(ticketId);

        Assert.NotNull(result);
        Assert.Equal(ticketId, result.Id);
        Assert.Equal("Pescadería Mar Azul", result.SupplierName);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenDoesNotExist()
    {
        var ticketId = Guid.NewGuid();

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync((ExpenseTicket?)null);

        var useCase = CreateUseCase();
        var result = await useCase.GetByIdAsync(ticketId);

        Assert.Null(result);
    }
}
