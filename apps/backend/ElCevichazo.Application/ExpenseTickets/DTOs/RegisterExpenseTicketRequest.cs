using System.ComponentModel.DataAnnotations;
using ElCevichazo.Domain.Enums;

namespace ElCevichazo.Application.ExpenseTickets.DTOs;

public class RegisterExpenseTicketRequest
{
    [Required(ErrorMessage = "El proveedor es obligatorio.")]
    public Guid SupplierId { get; set; }

    [Required(ErrorMessage = "La fecha del gasto es obligatoria.")]
    public DateTime ExpenseDate { get; set; }

    [Required(ErrorMessage = "La descripción es obligatoria.")]
    [MaxLength(250, ErrorMessage = "La descripción no puede exceder los 250 caracteres.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "El importe es obligatorio.")]
    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "El importe debe ser mayor a 0.")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "El método de pago es obligatorio.")]
    public PaymentMethod PaymentMethod { get; set; }

    [Required(ErrorMessage = "El estado del pago es obligatorio.")]
    public PaymentStatus PaymentStatus { get; set; }

    [MaxLength(500, ErrorMessage = "Las observaciones no pueden exceder los 500 caracteres.")]
    public string? Notes { get; set; }

    [MaxLength(500)]
    public string? VoucherUrl { get; set; }

    [MaxLength(255)]
    public string? VoucherOriginalName { get; set; }

    [MaxLength(500)]
    public string? TransferVoucherUrl { get; set; }

    [MaxLength(255)]
    public string? TransferVoucherOriginalName { get; set; }

    public Guid? RegisteredByUserId { get; set; }
}

public class RegisterRequest : RegisterExpenseTicketRequest
{
}
