using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Domain.Entities;


namespace ElCevichazo.Application.Suppliers.UseCases;
public class RegisterSuppliersUseCase
{
    private readonly ISuppliersRepository _suppliersRepository;

    public RegisterSuppliersUseCase(ISuppliersRepository suppliersRepository)
    {
        _suppliersRepository = suppliersRepository;
    }

    public async Task<RegisterResponse?> ExecuteAsync(RegisterRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            var existingSupplier =
                await _suppliersRepository.GetByPhoneAsync(request.Phone.Trim());

            if (existingSupplier is not null)
            {
                return null;
            }
        }
        
        var supplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Phone = string.IsNullOrWhiteSpace(request.Phone)
            ? null
            : request.Phone.Trim(),
            Notes = request.Notes,
            IsActive = true,
        };

        await _suppliersRepository.AddAsync(supplier);

        return new RegisterResponse
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Phone = supplier.Phone,
            Notes = supplier.Notes,
            IsActive = supplier.IsActive,
        };
    }
}