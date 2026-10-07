using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Users.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync (string email);
    Task AddAsync (User user);
    Task <List<User>> GetAllAsync ();
    Task UpdateAsync (User user);
    Task<User?> GetByIdAsync (Guid id);
}