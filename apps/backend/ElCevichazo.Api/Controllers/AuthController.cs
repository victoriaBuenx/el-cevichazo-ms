using ElCevichazo.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using ElCevichazo.Application.Auth.DTOs;
namespace ElCevichazo.Api.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;
    private readonly RegisterUseCase _registerUseCase;

    public AuthController(LoginUseCase loginUseCase, RegisterUseCase registerUseCase)
    {
        _loginUseCase = loginUseCase;
        _registerUseCase = registerUseCase;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _loginUseCase.ExecuteAsync(request);

        if (response is null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var response = await _registerUseCase.ExecuteAsync(request);

        if (response is null)
            return Conflict(new {message = "The email address is already registered"});
        
        return StatusCode(StatusCodes.Status201Created, response);
    }


}