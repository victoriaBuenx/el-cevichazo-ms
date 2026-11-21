using System.ComponentModel.DataAnnotations;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.Services.DTOs;

public class UpdateServiceRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public Guid? SupplierId { get; set; }

    [Range(typeof(decimal), "0", "9999999999999999.99")]
    public decimal? Amount { get; set; }

    [EnumDataType(typeof(PaymentFrequency))]
    public PaymentFrequency PaymentFrequency { get; set; }

    public DateOnly? NextDueDate { get; set; }

    public bool ReminderEnabled { get; set; }

    [Range(1, 365)]
    public int? ReminderDaysBefore { get; set; }
}