using ElCevichazo.Domain.Enums;
namespace ElCevichazo.Domain.Entities;

public class User
{
    public Guid Id {get ; set;}
    public string UserName {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public string PasswordHash {get; set;} = string.Empty;
    public bool IsActive {get; set;} = true;
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;
    public UserRole Role {get; set;}
    public ICollection<RefreshToken> RefreshTokens {get; set;} = new List<RefreshToken>();

}