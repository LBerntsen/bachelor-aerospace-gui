using API.Attributes;
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

    [HttpPost("{id}")]
    public async Task<IActionResult> SendCommand(int id)
    {
        bool success = await _commandService.SendCommandByIdAsync(id);

        if (success)
            return Ok();
        return StatusCode(StatusCodes.Status500InternalServerError);
    }
}