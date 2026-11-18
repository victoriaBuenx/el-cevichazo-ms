using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Exceptions;
using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.ExpenseTickets.UseCases;

public class UpdateExpenseTicketUseCase
{
    private readonly IExpenseTicketRepository _expenseTicketRepository;
    private readonly ISuppliersRepository _suppliersRepository;

    public UpdateExpenseTicketUseCase(
        IExpenseTicketRepository expenseTicketRepository,
        ISuppliersRepository suppliersRepository)
    {
        _expenseTicketRepository = expenseTicketRepository;
        _suppliersRepository = suppliersRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateExpenseTicketRequest request)
    {
        var ticket = await _expenseTicketRepository.GetByIdAsync(id);
        if (ticket is null)
        {
            return false;
        }

        if (request.SupplierId == Guid.Empty)
        {
            throw new ArgumentException("El proveedor es obligatorio.");
        }

        if (ticket.SupplierId != request.SupplierId)
        {
            var supplier = await _suppliersRepository.GetByIdAsync(request.SupplierId);
            if (supplier is null)
            {
                throw new SupplierNotFoundException("El proveedor asociado no existe.");
            }

            if (!supplier.IsActive)
            {
                throw new InvalidOperationException("No se pueden asociar gastos a un proveedor inactivo.");
            }

            ticket.SupplierId = supplier.Id;
        }

        if (request.Amount <= 0)
        {
            throw new ArgumentException("El importe debe ser mayor a 0.");
        }

        var trimmedDescription = request.Description?.Trim();
        if (string.IsNullOrWhiteSpace(trimmedDescription))
        {
            throw new ArgumentException("La descripción es obligatoria.");
        }

        if (!Enum.IsDefined(typeof(PaymentMethod), request.PaymentMethod))
        {
            throw new InvalidPaymentInfoException("El método de pago no es válido.");
        }

        if (!Enum.IsDefined(typeof(PaymentStatus), request.PaymentStatus))
        {
            throw new InvalidPaymentInfoException("El estado del pago no es válido.");
        }

        var expenseDateUtc = request.ExpenseDate.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(request.ExpenseDate, DateTimeKind.Utc)
            : request.ExpenseDate.ToUniversalTime();

        ticket.ExpenseDate = expenseDateUtc;
        ticket.Description = trimmedDescription;
        ticket.Amount = decimal.Round(request.Amount, 2);
        ticket.PaymentMethod = request.PaymentMethod;
        ticket.PaymentStatus = request.PaymentStatus;
        ticket.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        ticket.VoucherUrl = string.IsNullOrWhiteSpace(request.VoucherUrl) ? null : request.VoucherUrl.Trim();
        ticket.VoucherOriginalName = string.IsNullOrWhiteSpace(request.VoucherOriginalName) ? null : request.VoucherOriginalName.Trim();
        ticket.TransferVoucherUrl = string.IsNullOrWhiteSpace(request.TransferVoucherUrl) ? null : request.TransferVoucherUrl.Trim();
        ticket.TransferVoucherOriginalName = string.IsNullOrWhiteSpace(request.TransferVoucherOriginalName) ? null : request.TransferVoucherOriginalName.Trim();

        if (request.PaymentStatus == PaymentStatus.Paid)
        {
            ticket.PaidAt ??= DateTime.UtcNow;
        }
        else
        {
            ticket.PaidAt = null;
        }

        ticket.UpdatedAt = DateTime.UtcNow;

        await _expenseTicketRepository.UpdateAsync(ticket);
        return true;
    }
}
