using ElCevichazo.Application.Suppliers.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ElCevichazo.Application.Suppliers.DTOs;
namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/suppliers")]
public class SuppliersController : ControllerBase
{
    private readonly GetSuppliersUseCase _getSuppliersUseCase;
    private readonly RegisterSuppliersUseCase _registerUseCase;

    public SuppliersController(GetSuppliersUseCase getSuppliersUseCase, RegisterSuppliersUseCase registerUseCase)
    {
        _getSuppliersUseCase = getSuppliersUseCase;
        _registerUseCase = registerUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _getSuppliersUseCase.ExecuteAsync();
        return Ok(users);
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

}