using ElCevichazo.Application.Auth.DTOs;
namespace ElCevichazo.Application.Users.DTOs;

public class RegisterResponse
{
    public UserAuthResponse User { get; set; } = null!;
}