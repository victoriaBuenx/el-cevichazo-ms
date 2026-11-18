using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Exceptions;
using ElCevichazo.Application.ExpenseTickets.Interfaces;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.ExpenseTickets.UseCases;

public class RegisterExpenseTicketUseCase
{
    private readonly IExpenseTicketRepository _expenseTicketRepository;
    private readonly ISuppliersRepository _suppliersRepository;

    public RegisterExpenseTicketUseCase(
        IExpenseTicketRepository expenseTicketRepository,
        ISuppliersRepository suppliersRepository)
    {
        _expenseTicketRepository = expenseTicketRepository;
        _suppliersRepository = suppliersRepository;
    }

    public async Task<RegisterExpenseTicketResponse> ExecuteAsync(
        RegisterExpenseTicketRequest request,
        Guid? authenticatedUserId = null)
    {
        if (request.SupplierId == Guid.Empty)
        {
            throw new ArgumentException("El proveedor es obligatorio.");
        }

        var supplier = await _suppliersRepository.GetByIdAsync(request.SupplierId);
        if (supplier is null)
        {
            throw new SupplierNotFoundException("El proveedor asociado no existe.");
        }

        if (!supplier.IsActive)
        {
            throw new InvalidOperationException("No se pueden registrar gastos para un proveedor inactivo.");
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

        DateTime? paidAt = request.PaymentStatus == PaymentStatus.Paid
            ? DateTime.UtcNow
            : null;

        var effectiveUserId = request.RegisteredByUserId ?? authenticatedUserId;

        var ticket = new ExpenseTicket
        {
            Id = Guid.NewGuid(),
            SupplierId = supplier.Id,
            ExpenseDate = expenseDateUtc,
            Description = trimmedDescription,
            Amount = decimal.Round(request.Amount, 2),
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = request.PaymentStatus,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            VoucherUrl = string.IsNullOrWhiteSpace(request.VoucherUrl) ? null : request.VoucherUrl.Trim(),
            VoucherOriginalName = string.IsNullOrWhiteSpace(request.VoucherOriginalName) ? null : request.VoucherOriginalName.Trim(),
            TransferVoucherUrl = string.IsNullOrWhiteSpace(request.TransferVoucherUrl) ? null : request.TransferVoucherUrl.Trim(),
            TransferVoucherOriginalName = string.IsNullOrWhiteSpace(request.TransferVoucherOriginalName) ? null : request.TransferVoucherOriginalName.Trim(),
            RegisteredByUserId = effectiveUserId,
            PaidAt = paidAt,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _expenseTicketRepository.AddAsync(ticket);

        return new RegisterExpenseTicketResponse
        {
            Id = ticket.Id,
            SupplierId = ticket.SupplierId,
            SupplierName = supplier.Name,
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
            RegisteredByUserId = ticket.RegisteredByUserId,
            PaidAt = ticket.PaidAt,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };
    }
}
