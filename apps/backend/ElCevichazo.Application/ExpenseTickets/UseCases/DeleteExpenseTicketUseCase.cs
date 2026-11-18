using ElCevichazo.Application.ExpenseTickets.Interfaces;

namespace ElCevichazo.Application.ExpenseTickets.UseCases;

public class DeleteExpenseTicketUseCase
{
    private readonly IExpenseTicketRepository _expenseTicketRepository;

    public DeleteExpenseTicketUseCase(IExpenseTicketRepository expenseTicketRepository)
    {
        _expenseTicketRepository = expenseTicketRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {
        var ticket = await _expenseTicketRepository.GetByIdAsync(id);
        if (ticket is null)
        {
            return false;
        }

        await _expenseTicketRepository.DeleteAsync(ticket);
        return true;
    }
}
