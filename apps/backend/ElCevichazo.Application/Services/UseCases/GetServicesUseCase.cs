
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;

namespace ElCevichazo.Application.Services.UseCases;

public class GetServicesUseCase
{
    private readonly IServicesRepository _servicesRepository;

    public GetServicesUseCase(IServicesRepository servicesRepository)
    {
        _servicesRepository = servicesRepository;
    }

    public async Task<List<RegisterResponse>> ExecuteAsync()
    {
        var services = await _servicesRepository.GetAllAsync();

        return services.Select(s => new RegisterResponse
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            SupplierId = s.SupplierId,
            SupplierName = s.Supplier?.Name,
            Amount = s.Amount,
            PaymentFrequency = s.PaymentFrequency,
            NextDueDate = s.NextDueDate,
            IsActive = s.IsActive,
            ReminderEnabled = s.ReminderEnabled,
            ReminderDaysBefore = s.ReminderDaysBefore,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }).ToList();
    }
}
