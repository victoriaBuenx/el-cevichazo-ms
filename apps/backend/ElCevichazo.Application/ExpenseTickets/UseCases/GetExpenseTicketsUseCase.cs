using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.ExpenseTickets.UseCases;

public class GetExpenseTicketsUseCase
{
    private readonly IExpenseTicketRepository _expenseTicketRepository;

    public GetExpenseTicketsUseCase(IExpenseTicketRepository expenseTicketRepository)
    {
        _expenseTicketRepository = expenseTicketRepository;
    }

    public async Task<List<ExpenseTicketResponse>> ExecuteAsync()
    {
        var tickets = await _expenseTicketRepository.GetAllAsync();

        return tickets.Select(MapToResponse).ToList();
    }

    public async Task<ExpenseTicketResponse?> GetByIdAsync(Guid id)
    {
        var ticket = await _expenseTicketRepository.GetByIdAsync(id);
        if (ticket is null)
        {
            return null;
        }

        return MapToResponse(ticket);
    }

    private static ExpenseTicketResponse MapToResponse(ExpenseTicket ticket)
    {
        return new ExpenseTicketResponse
        {
            Id = ticket.Id,
            ExpenseDate = ticket.ExpenseDate,
            Description = ticket.Description,
            Amount = ticket.Amount,
            PaymentMethod = ticket.PaymentMethod,
            PaymentStatus = ticket.PaymentStatus,
            Notes = ticket.Notes,
            VoucherUrl = ticket.VoucherUrl,
            VoucherOriginalName = ticket.VoucherOriginalName,
            TransferVoucherUrl = ticket.TransferVoucherUrl,
            TransferVoucherOriginalName = ticket.TransferVoucherOriginalName,
            PaidAt = ticket.PaidAt,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
            SupplierId = ticket.SupplierId,
            SupplierName = ticket.Supplier?.Name ?? string.Empty,
            SupplierPhone = ticket.Supplier?.Phone,
            RegisteredByUserId = ticket.RegisteredByUserId,
            RegisteredByUserName = ticket.RegisteredByUser?.UserName
        };
    }
}
