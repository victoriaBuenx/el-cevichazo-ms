using ElCevichazo.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ElCevichazo.Application.Auth.DTOs;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/users")]

public class UsersController : ControllerBase
{
    private readonly GetUsersUseCase _getUsersUseCase;
    private readonly RegisterUseCase _registerUseCase;

    public UsersController(GetUsersUseCase getUsersUseCase, RegisterUseCase registerUseCase)
    {
        _getUsersUseCase = getUsersUseCase;
        _registerUseCase = registerUseCase;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _getUsersUseCase.ExecuteAsync();
        return Ok(users);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> CreateUser(RegisterRequest request)
    {
        var result = await _registerUseCase.ExecuteAsync(request);

        if (result is null)
        {
            return Conflict(new
            {
                message = "El correo electrónico ya está registrado."
            });
        }

        return StatusCode(StatusCodes.Status201Created, result);
    }
}