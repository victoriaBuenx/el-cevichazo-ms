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
        var trimmedPhone = request.Phone.Trim();
        if (!string.IsNullOrWhiteSpace(trimmedPhone))
        {
            var existingSupplier =
                await _suppliersRepository.GetByPhoneAsync(trimmedPhone);

            if (existingSupplier is not null)
            {
                return null;
            }
        }
        
        var supplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Phone = trimmedPhone,
            Notes = request.Notes?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _suppliersRepository.AddAsync(supplier);

        return new RegisterResponse
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Phone = supplier.Phone,
            Notes = supplier.Notes,
            IsActive = supplier.IsActive,
            CreatedAt = supplier.CreatedAt,
            UpdatedAt = supplier.UpdatedAt,
        };
    }
}
