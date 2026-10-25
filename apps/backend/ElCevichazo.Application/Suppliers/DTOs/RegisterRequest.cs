using System.ComponentModel.DataAnnotations;

namespace ElCevichazo.Application.Suppliers.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es obligatorio.")]
    [MaxLength(10, ErrorMessage = "El teléfono no puede exceder los 10 dígitos.")]
    [RegularExpression(@"^\d+$", ErrorMessage = "El teléfono solo debe contener números.")]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; } 
}
