using System.Globalization;
using API.Attributes;
using Domain.DTOs;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[OperatorOnly]
[CommandKey]
[ApiController]
[Route("api/[controller]")]
public class CommandController : ControllerBase
{
    private readonly ICommandService _commandService;

    public CommandController(ICommandService commandService)
    {
        _commandService = commandService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok();
    }

    [HttpPost("{idStr}")]
    public async Task<IActionResult> SendCommand(string idStr)
    {
        if (!int.TryParse(idStr, NumberStyles.Integer, null, out var id))
            return StatusCode(StatusCodes.Status400BadRequest,
                new CommandResponseDto(false, 400, "Command must be a valid integer"));
        
        CommandResponseDto response = await _commandService.SendCommandByIdAsync(id);
        return StatusCode(response.code, response);
    }
}