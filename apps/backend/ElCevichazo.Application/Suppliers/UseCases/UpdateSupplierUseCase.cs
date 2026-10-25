using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Exceptions;
using ElCevichazo.Application.Suppliers.Interfaces;

namespace ElCevichazo.Application.Suppliers.UseCases;

public class UpdateSupplierUseCase
{
    private readonly ISuppliersRepository _suppliersRepository;

    public UpdateSupplierUseCase(ISuppliersRepository suppliersRepository)
    {
        _suppliersRepository = suppliersRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateSupplierRequest request)
    {
        var supplier = await _suppliersRepository.GetByIdAsync(id);
        if (supplier is null)
            return false;

        var phone = request.Phone.Trim();
        var phoneExists = await _suppliersRepository.ExistsByPhoneAsync(
            phone,
            id
        );

        if (phoneExists)
            throw new DuplicateSupplierPhoneException();

        supplier.Name = request.Name.Trim();
        supplier.Phone = phone;
        supplier.Notes = request.Notes?.Trim();
        supplier.UpdatedAt = DateTime.UtcNow;

        await _suppliersRepository.UpdateAsync(supplier);
        return true;
    }
}
