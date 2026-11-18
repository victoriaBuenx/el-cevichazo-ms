using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.ExpenseTickets.Interfaces;

public interface IExpenseTicketRepository
{
    Task<ExpenseTicket?> GetByIdAsync(Guid id);
    Task<List<ExpenseTicket>> GetAllAsync();
    Task AddAsync(ExpenseTicket ticket);
    Task UpdateAsync(ExpenseTicket ticket);
    Task DeleteAsync(ExpenseTicket ticket);
}
