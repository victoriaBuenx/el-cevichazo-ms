using ElCevichazo.Application.Auth.UseCases;
using ElCevichazo.Application.Users.UseCases;
using ElCevichazo.Application.Users.DTOs;
using Microsoft.AspNetCore.Mvc;
using ElCevichazo.Application.Auth.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
namespace ElCevichazo.Api.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;
    private readonly RegisterUseCase _registerUseCase;
    private readonly LogoutUseCase _logoutUseCase;

    public AuthController(
        LoginUseCase loginUseCase,
        RegisterUseCase registerUseCase,
        LogoutUseCase logoutUseCase)
    {
        _loginUseCase = loginUseCase;
        _registerUseCase = registerUseCase;
        _logoutUseCase = logoutUseCase;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _loginUseCase.ExecuteAsync(request);

        if (response is null)
            return Unauthorized(new { message = "Verifica que tu correo electrónico y contraseña sean correctos." });

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var response = await _registerUseCase.ExecuteAsync(request);

        if (response is null)
            return Conflict(new {message = "El correo electrónico ya está registrado."});
        
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest? request)
    {
        Guid? userId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedGuid))
        {
            userId = parsedGuid;
        }

        await _logoutUseCase.ExecuteAsync(request, userId);

        return Ok(new { message = "Sesión cerrada correctamente." });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        return Ok(new
        {
            message = "Token válido.",
            userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            userName = User.FindFirst(ClaimTypes.Name)?.Value,
            email = User.FindFirst(ClaimTypes.Email)?.Value,
            role = User.FindFirst(ClaimTypes.Role)?.Value
        });
    }
}