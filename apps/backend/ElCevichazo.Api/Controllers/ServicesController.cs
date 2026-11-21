
using System.ComponentModel.DataAnnotations;
using ElCevichazo.Application.Services.DTOs;
using ElCevichazo.Application.Services.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController : ControllerBase
{
    private readonly GetServicesUseCase _getAllUseCase;
    private readonly RegisterServicesUseCase _registerUseCase;

    public ServicesController(
        GetServicesUseCase getAllUseCase,
        RegisterServicesUseCase registerUseCase)
    {
        _getAllUseCase = getAllUseCase;
        _registerUseCase = registerUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _getAllUseCase.ExecuteAsync();

        return Ok(services);
    }

    [HttpPost]
    public async Task<IActionResult> CreateService(RegisterRequest request)
    {
        try
        {
            var result = await _registerUseCase.ExecuteAsync(request);

            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
