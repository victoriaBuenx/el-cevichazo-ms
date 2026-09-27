using System.Runtime.CompilerServices;

namespace ElCevichazo.Application.Auth.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(Guid userId ,string email, string role);
}