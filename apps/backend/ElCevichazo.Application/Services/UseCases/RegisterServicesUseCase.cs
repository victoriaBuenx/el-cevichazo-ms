
using System.ComponentModel.DataAnnotations;
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.Interfaces;
using ElCevichazo.Application.Suppliers.Interfaces;
using ElCevichazo.Domain.Entities;

namespace ElCevichazo.Application.Services.UseCases;

public class RegisterServicesUseCase
{
    private readonly IServicesRepository _servicesRepository;
    private readonly ISuppliersRepository _suppliersRepository;

    public RegisterServicesUseCase(
        IServicesRepository servicesRepository,
        ISuppliersRepository suppliersRepository)
    {
        _servicesRepository = servicesRepository;
        _suppliersRepository = suppliersRepository;
    }

    public async Task<RegisterResponse> ExecuteAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("El nombre del servicio es obligatorio.");

        if (request.Amount < 0)
            throw new ValidationException("El importe no puede ser negativo.");

        if (!Enum.IsDefined(typeof(ElCevichazo.Domain.Enums.PaymentFrequency),
            request.PaymentFrequency))
        {
            throw new ValidationException("La frecuencia de pago no es válida.");
        }

        if (request.SupplierId.HasValue)
        {
            var supplier = await _suppliersRepository
                .GetByIdAsync(request.SupplierId.Value);

            if (supplier is null)
                throw new ValidationException("El proveedor seleccionado no existe.");

            if (!supplier.IsActive)
                throw new ValidationException("El proveedor seleccionado está inactivo.");
        }

        if (request.ReminderEnabled &&
            (!request.ReminderDaysBefore.HasValue ||
             request.ReminderDaysBefore < 1 ||
             request.ReminderDaysBefore > 365))
        {
            throw new ValidationException(
                "Indica entre 1 y 365 días de anticipación para el recordatorio.");
        }

        var now = DateTime.UtcNow;

        var service = new Service
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim(),
            SupplierId = request.SupplierId,
            Amount = request.Amount,
            PaymentFrequency = request.PaymentFrequency,
            NextDueDate = request.NextDueDate,
            IsActive = true,
            ReminderEnabled = request.ReminderEnabled,
            ReminderDaysBefore = request.ReminderEnabled
                ? request.ReminderDaysBefore
                : null,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _servicesRepository.AddAsync(service);

        return new RegisterResponse
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            SupplierId = service.SupplierId,
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
