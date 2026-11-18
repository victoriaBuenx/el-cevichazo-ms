using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace ElCevichazo.Infrastructure.Repositories;

public class ExpenseTicketRepository : IExpenseTicketRepository
{
    private readonly AppDbContext _dbContext;

    public ExpenseTicketRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ExpenseTicket?> GetByIdAsync(Guid id)
    {
        return await _dbContext.ExpenseTickets
            .Include(t => t.Supplier)
            .Include(t => t.RegisteredByUser)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<ExpenseTicket>> GetAllAsync()
    {
        return await _dbContext.ExpenseTickets
            .Include(t => t.Supplier)
            .AsNoTracking()
            .OrderByDescending(t => t.ExpenseDate)
            .ToListAsync();
    }

    public async Task AddAsync(ExpenseTicket ticket)
    {
        await _dbContext.ExpenseTickets.AddAsync(ticket);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(ExpenseTicket ticket)
    {
        _dbContext.ExpenseTickets.Update(ticket);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(ExpenseTicket ticket)
    {
        _dbContext.ExpenseTickets.Remove(ticket);
        await _dbContext.SaveChangesAsync();
    }
}
