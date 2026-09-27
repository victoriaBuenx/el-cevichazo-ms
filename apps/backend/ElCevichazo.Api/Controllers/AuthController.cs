using ElCevichazo.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using ElCevichazo.Application.Auth.DTOs;
namespace ElCevichazo.Api.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;

    public AuthController(LoginUseCase loginUseCase)
    {
        _loginUseCase = loginUseCase;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _loginUseCase.ExecuteAsync(request);

        if (response is null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(response);
    }


}