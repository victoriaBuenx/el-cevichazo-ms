namespace ElCevichazo.Application.Suppliers.DTOs;
public class RegisterRequest
{
    public string Name {get; set;} = string.Empty;
    public string? Phone { get; set; } 
    public string? Notes { get; set; } 
}