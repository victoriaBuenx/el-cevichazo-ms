using System.ComponentModel.DataAnnotations;

namespace ElCevichazo.Domain.Entities;

public class Supplier
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    [RegularExpression(@"^\d+$", ErrorMessage = "El teléfono solo debe contener números.")]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
