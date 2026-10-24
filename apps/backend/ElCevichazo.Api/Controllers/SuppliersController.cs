using ElCevichazo.Application.Suppliers.UseCases;
using Microsoft.AspNetCore.Mvc;
namespace ElCevichazo.Api.Controllers;

public class SuppliersController : ControllerBase
{
    private readonly GetSuppliersUseCase _getSuppliersUseCase;

    public SuppliersController(GetSuppliersUseCase getSuppliersUseCase)
    {
        _getSuppliersUseCase = getSuppliersUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _getSuppliersUseCase.ExecuteAsync();
        return Ok(users);
    }
}