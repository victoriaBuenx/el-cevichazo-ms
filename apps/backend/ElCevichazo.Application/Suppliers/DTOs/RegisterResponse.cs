namespace ElCevichazo.Application.Suppliers.DTOs;
public class RegisterResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}