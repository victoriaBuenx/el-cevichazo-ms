using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Interfaces;

namespace ElCevichazo.Application.Suppliers.UseCases;

public class UpdateSupplierStatusUseCase
{
    private readonly ISuppliersRepository _suppliersRepository;

    public UpdateSupplierStatusUseCase(ISuppliersRepository suppliersRepository)
    {
        _suppliersRepository = suppliersRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id, UpdateSupplierStatusRequest request)
    {
        var supplier = await _suppliersRepository.GetByIdAsync(id);

        if (supplier is null)
            return false;

        supplier.IsActive = request.IsActive;
        supplier.UpdatedAt = DateTime.UtcNow;
        await _suppliersRepository.UpdateAsync(supplier);
        return true;
    }
}
