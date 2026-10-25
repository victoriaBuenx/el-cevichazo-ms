using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Suppliers.Interfaces;
public interface ISuppliersRepository
{
    Task <List<Supplier>> GetAllAsync(); 
    Task AddAsync (Supplier supplier);
    Task<Supplier?> GetByPhoneAsync(string phone);
}