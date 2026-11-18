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
    private readonly GetExpenseTicketsUseCase _getExpenseTicketsUseCase;
    private readonly RegisterExpenseTicketUseCase _registerUseCase;
    private readonly UpdateExpenseTicketUseCase _updateExpenseTicketUseCase;
    private readonly DeleteExpenseTicketUseCase _deleteExpenseTicketUseCase;

    public TicketsController(
        GetExpenseTicketsUseCase getExpenseTicketsUseCase,
        RegisterExpenseTicketUseCase registerUseCase,
        UpdateExpenseTicketUseCase updateExpenseTicketUseCase,
        DeleteExpenseTicketUseCase deleteExpenseTicketUseCase)
    {
        _getExpenseTicketsUseCase = getExpenseTicketsUseCase;
        _registerUseCase = registerUseCase;
        _updateExpenseTicketUseCase = updateExpenseTicketUseCase;
        _deleteExpenseTicketUseCase = deleteExpenseTicketUseCase;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tickets = await _getExpenseTicketsUseCase.ExecuteAsync();
        return Ok(tickets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ticket = await _getExpenseTicketsUseCase.GetByIdAsync(id);
        if (ticket is null)
        {
            return NotFound(new
            {
                message = "Ticket no encontrado."
            });
        }

        return Ok(ticket);
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

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTicket(Guid id, [FromBody] UpdateExpenseTicketRequest request)
    {
        try
        {
            var updated = await _updateExpenseTicketUseCase.ExecuteAsync(id, request);
            if (!updated)
            {
                return NotFound(new
                {
                    message = "Ticket no encontrado."
                });
            }

            return NoContent();
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

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTicket(Guid id)
    {
        var deleted = await _deleteExpenseTicketUseCase.ExecuteAsync(id);
        if (!deleted)
        {
            return NotFound(new
            {
                message = "Ticket no encontrado."
            });
        }

        return NoContent();
    }
}
