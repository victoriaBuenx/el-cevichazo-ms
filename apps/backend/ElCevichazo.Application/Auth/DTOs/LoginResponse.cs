namespace ElCevichazo.Application.Auth.DTOs;

public class LoginResponse
{
    public string AccessToken {get; set;} = string.Empty;
    public string RefreshToken {get; set;} = string.Empty;
    public DateTime Expiration {get; set;} 
    public UserAuthResponse User {get; set;} = null!;

}

public class UserAuthResponse
{
    public Guid Id {get; set;}
    public string UserName {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public bool IsActive {get; set;}
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    public string Role {get; set;} = string.Empty;

}