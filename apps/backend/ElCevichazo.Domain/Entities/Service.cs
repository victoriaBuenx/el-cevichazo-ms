using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public Guid? SupplierId { get; set; }

    public Supplier? Supplier { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Amount { get; set; }

    [Required]
    public PaymentFrequency PaymentFrequency { get; set; }

    public DateOnly? NextDueDate { get; set; }

    public bool IsActive { get; set; } = true;

    public bool ReminderEnabled { get; set; } = false;

    public int? ReminderDaysBefore { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
