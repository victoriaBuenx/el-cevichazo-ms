using ElCevichazo.Application.Suppliers.DTOs;
using ElCevichazo.Application.Suppliers.Exceptions;
using ElCevichazo.Application.Suppliers.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/suppliers")]
public class SuppliersController : ControllerBase
{
    private readonly GetSuppliersUseCase _getSuppliersUseCase;
    private readonly RegisterSuppliersUseCase _registerUseCase;
    private readonly UpdateSupplierUseCase _updateSupplierUseCase;
    private readonly UpdateSupplierStatusUseCase _updateSupplierStatusUseCase;

    public SuppliersController(
        GetSuppliersUseCase getSuppliersUseCase,
        RegisterSuppliersUseCase registerUseCase,
        UpdateSupplierUseCase updateSupplierUseCase,
        UpdateSupplierStatusUseCase updateSupplierStatusUseCase)
    {
        _getSuppliersUseCase = getSuppliersUseCase;
        _registerUseCase = registerUseCase;
        _updateSupplierUseCase = updateSupplierUseCase;
        _updateSupplierStatusUseCase = updateSupplierStatusUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var suppliers = await _getSuppliersUseCase.ExecuteAsync();
        return Ok(suppliers);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSupplier(RegisterRequest request)
    {
        var result = await _registerUseCase.ExecuteAsync(request);

        if (result is null)
        {
            return Conflict(new
            {
                message = "El número de teléfono ya está registrado."
            });
        }

        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSupplier(
        Guid id,
        UpdateSupplierRequest request)
    {
        try
        {
            var updated = await _updateSupplierUseCase.ExecuteAsync(id, request);

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Proveedor no encontrado."
                });
            }

            return NoContent();
        }
        catch (DuplicateSupplierPhoneException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateSupplierStatus(Guid id, UpdateSupplierStatusRequest request)
    {
        var updated = await _updateSupplierStatusUseCase.ExecuteAsync(id, request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Proveedor no encontrado."
            });
        }

        return NoContent();
    }
}

