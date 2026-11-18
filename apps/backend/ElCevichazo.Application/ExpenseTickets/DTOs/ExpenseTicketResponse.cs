using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.ExpenseTickets.DTOs;

public class ExpenseTicketResponse
{
    public Guid Id { get; set; }
    public DateTime ExpenseDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string? Notes { get; set; }
    public string? VoucherUrl { get; set; }
    public string? VoucherOriginalName { get; set; }
    public string? TransferVoucherUrl { get; set; }
    public string? TransferVoucherOriginalName { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Guid SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string? SupplierPhone { get; set; }

    public Guid? RegisteredByUserId { get; set; }
    public string? RegisteredByUserName { get; set; }
}
