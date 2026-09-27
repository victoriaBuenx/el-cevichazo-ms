using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Auth.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync (string email);
}