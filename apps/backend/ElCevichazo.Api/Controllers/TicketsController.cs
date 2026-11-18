using System.Security.Claims;
using ElCevichazo.Application.ExpenseTickets.DTOs;
using ElCevichazo.Application.ExpenseTickets.Exceptions;
using ElCevichazo.Application.ExpenseTickets.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace ElCevichazo.Api.Controllers;

[ApiController]
[Route("api/tickets")]
public class TicketsController : ControllerBase
{
    private readonly RegisterExpenseTicketUseCase _registerUseCase;

    public TicketsController(RegisterExpenseTicketUseCase registerUseCase)
    {
        _registerUseCase = registerUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket([FromBody] RegisterExpenseTicketRequest request)
    {
        try
        {
            Guid? userId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            var result = await _registerUseCase.ExecuteAsync(request, userId);
            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (SupplierNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidPaymentInfoException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
