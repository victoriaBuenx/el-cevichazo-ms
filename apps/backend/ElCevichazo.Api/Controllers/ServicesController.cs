
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
    private readonly UpdateServiceUseCase _updateUseCase;
    private readonly UpdateServiceStatusUseCase _changeStatusUseCase;

    public ServicesController(
        GetServicesUseCase getAllUseCase,
        RegisterServicesUseCase registerUseCase,
        UpdateServiceUseCase updateUseCase,
        UpdateServiceStatusUseCase changeStatusUseCase)
    {
        _getAllUseCase = getAllUseCase;
        _registerUseCase = registerUseCase;
        _updateUseCase = updateUseCase;
        _changeStatusUseCase = changeStatusUseCase;
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

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateService(
        Guid id,
        UpdateServiceRequest request)
    {
        try
        {
            var result = await _updateUseCase.ExecuteAsync(id, request);

            if (result is null)
                return NotFound(new { message = "El servicio no existe." });

            return Ok(result);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ChangeServiceStatus(
        Guid id,
        UpdateStatusRequest request)
    {
        var result = await _changeStatusUseCase.ExecuteAsync(id, request);

        if (result is null)
            return NotFound(new { message = "El servicio no existe." });

        return Ok(result);
    }
}
