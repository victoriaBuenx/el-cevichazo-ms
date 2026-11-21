using System.ComponentModel.DataAnnotations;
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Suppliers.Interfaces;

namespace ElCevichazo.Application.Services.UseCases;

public class UpdateServiceUseCase
{
    private readonly IServicesRepository _servicesRepository;
    private readonly ISuppliersRepository _suppliersRepository;

    public UpdateServiceUseCase(
        IServicesRepository servicesRepository,
        ISuppliersRepository suppliersRepository)
    {
        _servicesRepository = servicesRepository;
        _suppliersRepository = suppliersRepository;
    }

    public async Task<RegisterResponse?> ExecuteAsync(
        Guid id,
        UpdateServiceRequest request)
    {
        var service = await _servicesRepository.GetByIdAsync(id);

        if (service is null)
            return null;

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException(
                "El nombre del servicio es obligatorio.");

        if (request.Amount < 0)
            throw new ValidationException(
                "El importe no puede ser negativo.");

        if (!Enum.IsDefined(typeof(
            ElCevichazo.Domain.Enums.PaymentFrequency),
            request.PaymentFrequency))
        {
            throw new ValidationException(
                "La frecuencia de pago no es válida.");
        }

        var supplierName = (string?)null;

        if (request.SupplierId.HasValue)
        {
            var supplier = await _suppliersRepository
                .GetByIdAsync(request.SupplierId.Value);

            if (supplier is null)
                throw new ValidationException(
                    "El proveedor seleccionado no existe.");

            if (!supplier.IsActive)
                throw new ValidationException(
                    "El proveedor seleccionado está inactivo.");

            supplierName = supplier.Name;
        }

        if (request.ReminderEnabled &&
            (!request.ReminderDaysBefore.HasValue ||
             request.ReminderDaysBefore < 1 ||
             request.ReminderDaysBefore > 365))
        {
            throw new ValidationException(
                "Indica entre 1 y 365 días de anticipación para el recordatorio.");
        }

        service.Name = request.Name.Trim();
        service.Description = string.IsNullOrWhiteSpace(request.Description)
            ? null
            : request.Description.Trim();
        service.SupplierId = request.SupplierId;
        service.Amount = request.Amount;
        service.PaymentFrequency = request.PaymentFrequency;
        service.NextDueDate = request.NextDueDate;
        service.ReminderEnabled = request.ReminderEnabled;
        service.ReminderDaysBefore = request.ReminderEnabled
            ? request.ReminderDaysBefore
            : null;
        service.UpdatedAt = DateTime.UtcNow;

        await _servicesRepository.UpdateAsync(service);

        return new RegisterResponse
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            SupplierId = service.SupplierId,
            SupplierName = supplierName,
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