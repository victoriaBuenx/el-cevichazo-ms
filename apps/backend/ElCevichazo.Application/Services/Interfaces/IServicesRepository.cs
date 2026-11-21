
using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Services.Interfaces;

public interface IServicesRepository
{
    Task<List<Service>> GetAllAsync();
    Task AddAsync(Service service);
    Task<Service?> GetByIdAsync(Guid id);
    Task UpdateAsync(Service service);
}
