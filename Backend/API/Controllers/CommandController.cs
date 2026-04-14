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

    [HttpPost("{id:int}")]
    public async Task<IActionResult> SendCommand(int id)
    {
        CommandResponseDto response = await _commandService.SendCommandByIdAsync(id);
        return StatusCode(response.code, response);
    }
}