using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;

namespace ElCevichazo.Application.Services.UseCases;

public class UpdateServiceStatusUseCase
{
    private readonly IServicesRepository _servicesRepository;

    public UpdateServiceStatusUseCase(IServicesRepository servicesRepository)
    {
        _servicesRepository = servicesRepository;
    }

    public async Task<RegisterResponse?> ExecuteAsync(
        Guid id,
        UpdateStatusRequest request)
    {
        var service = await _servicesRepository.GetByIdAsync(id);

        if (service is null)
            return null;

        service.IsActive = request.IsActive;
        service.UpdatedAt = DateTime.UtcNow;

        await _servicesRepository.UpdateAsync(service);

        return new RegisterResponse
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            SupplierId = service.SupplierId,
            SupplierName = service.Supplier?.Name,
            Amount = service.Amount,
            PaymentFrequency = service.PaymentFrequency,
            NextDueDate = service.NextDueDate,
            IsActive = service.IsActive,
            ReminderEnabled = service.ReminderEnabled,
            ReminderDaysBefore = service.ReminderDaysBefore,
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.UpdatedAt
        };
    }
}