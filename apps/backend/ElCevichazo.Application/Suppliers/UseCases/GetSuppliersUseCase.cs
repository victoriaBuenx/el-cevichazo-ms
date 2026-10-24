using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Application.Suppliers.DTOs;

namespace ElCevichazo.Application.Suppliers.UseCases;
public class GetSuppliersUseCase
{
    private readonly ISuppliersRepository _supplierRepository;

    public GetSuppliersUseCase(ISuppliersRepository supplierRepository)
    {
        _supplierRepository = supplierRepository;
    }

    public async Task<List<SupplierListResponse>> ExecuteAsync()
    {
        var users = await _supplierRepository.GetAllAsync();

        return users.Select(s => new SupplierListResponse
        {
            Id = s.Id,
            Name = s.Name,
            Phone = s.Phone,
            Notes = s.Notes,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt
        }).ToList();
    }
}