using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Domain.Entities;

public class ExpenseTicket
{
    public Guid Id { get; set; }

    [Required]
    public DateTime ExpenseDate { get; set; }

    [Required]
    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    [Required]
    public PaymentStatus PaymentStatus { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [MaxLength(500)]
    public string? VoucherUrl { get; set; }

    [MaxLength(255)]
    public string? VoucherOriginalName { get; set; }

    [MaxLength(500)]
    public string? TransferVoucherUrl { get; set; }

    [MaxLength(255)]
    public string? TransferVoucherOriginalName { get; set; }

    [Required]
    public Guid SupplierId { get; set; }

    public Supplier Supplier { get; set; } = null!;

    public Guid? RegisteredByUserId { get; set; }

    public User? RegisteredByUser { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
