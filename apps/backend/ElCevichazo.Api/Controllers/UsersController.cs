using ElCevichazo.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/users")]

public class UsersController : ControllerBase
{
    private readonly GetUsersUseCase _getUsersUseCase;

    public UsersController(GetUsersUseCase getUsersUseCase)
    {
        _getUsersUseCase = getUsersUseCase;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _getUsersUseCase.ExecuteAsync();
        return Ok(users);
    }
}