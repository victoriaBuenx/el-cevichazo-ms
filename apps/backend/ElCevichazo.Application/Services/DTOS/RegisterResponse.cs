
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.Services.DTOs;

public class RegisterResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public decimal? Amount { get; set; }
    public PaymentFrequency PaymentFrequency { get; set; }
    public DateOnly? NextDueDate { get; set; }
    public bool IsActive { get; set; }
    public bool ReminderEnabled { get; set; }
    public int? ReminderDaysBefore { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
