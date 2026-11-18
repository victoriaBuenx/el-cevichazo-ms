using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.ExpenseTickets.UseCases;
using ElCevichazo.Domain.Entities;
using Moq;

namespace ElCevichazo.Tests.ExpenseTickets;

public class DeleteExpenseTicketUseCaseTests
{
    private readonly Mock<IExpenseTicketRepository> _expenseTicketRepositoryMock = new();

    private DeleteExpenseTicketUseCase CreateUseCase()
    {
        return new DeleteExpenseTicketUseCase(_expenseTicketRepositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnFalse_WhenTicketDoesNotExist()
    {
        var ticketId = Guid.NewGuid();

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync((ExpenseTicket?)null);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(ticketId);

        Assert.False(result);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.DeleteAsync(It.IsAny<ExpenseTicket>()),
            Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldDeleteTicketAndReturnTrue_WhenTicketExists()
    {
        var ticketId = Guid.NewGuid();
        var ticket = new ExpenseTicket
        {
            Id = ticketId,
            Description = "Gasto a eliminar",
            Amount = 100m
        };

        _expenseTicketRepositoryMock
            .Setup(repo => repo.GetByIdAsync(ticketId))
            .ReturnsAsync(ticket);

        var useCase = CreateUseCase();
        var result = await useCase.ExecuteAsync(ticketId);

        Assert.True(result);

        _expenseTicketRepositoryMock.Verify(
            repo => repo.DeleteAsync(ticket),
            Times.Once);
    }
}
