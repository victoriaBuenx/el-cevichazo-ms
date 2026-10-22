using System.ComponentModel.DataAnnotations;

namespace ElCevichazo.Domain.Entities;

public class Suppliers
{
    public Guid Id {get; set;}
    public string Name {get; set;} = string.Empty;

    [MaxLength(10)]

    public string? Phone { get; set; }


    [MaxLength(500)]
    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}