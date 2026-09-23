using System.ComponentModel.DataAnnotations;
using ElCevichazo.Domain.Enums;
namespace ElCevichazo.Domain.Entities;

public class User
{
    public Guid Id {get ; set;}
    
    [Required]
    [MaxLength(100)]
    public string UserName {get; set;} = string.Empty;

    [Required]
    [MaxLength(250)]
    [EmailAddress]
    public string Email {get; set;} = string.Empty;

    [Required]
    public string PasswordHash {get; set;} = string.Empty;
    public bool IsActive {get; set;} = true;
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;
    public UserRole Role {get; set;}
    public ICollection<RefreshToken> RefreshTokens {get; set;} = new List<RefreshToken>();

}