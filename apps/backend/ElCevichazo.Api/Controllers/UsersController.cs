using ElCevichazo.Application.Users.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ElCevichazo.Application.Users.DTOs;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/users")]

public class UsersController : ControllerBase
{
    private readonly GetUsersUseCase _getUsersUseCase;
    private readonly RegisterUseCase _registerUseCase;
    private readonly UpdateUserUseCase _upadteUserUseCase;
    private readonly UpdateUserStatusUseCase _updateUserStatusUseCase;

    public UsersController(GetUsersUseCase getUsersUseCase, RegisterUseCase registerUseCase, UpdateUserUseCase updateUserUseCase, UpdateUserStatusUseCase updateUserStatusUseCase)
    {
        _getUsersUseCase = getUsersUseCase;
        _registerUseCase = registerUseCase;
        _upadteUserUseCase = updateUserUseCase;
        _updateUserStatusUseCase = updateUserStatusUseCase;
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

    [HttpPut("{id:guid}")]
    [Authorize (Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
    {
        var updated = await _upadteUserUseCase.ExecuteAsync(id, request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        return NoContent();
    }
    
    [HttpPatch("{id:guid}/status")]
    [Authorize (Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateUserSatus(Guid id, UpdateUserStatusRequest request)
    {
        var updated = await _updateUserStatusUseCase.ExecuteAsync(id, request);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        return NoContent();
    }
}