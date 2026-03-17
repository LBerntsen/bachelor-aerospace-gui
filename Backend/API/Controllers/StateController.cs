using Domain.Enums;
using Domain.Services;
using Infrastructure.DataIngestion;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StateController : ControllerBase
{
    private readonly SystemStateService _stateService;
    private readonly SourceController _sourceController;
    
    public StateController(SystemStateService stateService, SourceController sourceController)
    {
        _stateService = stateService;
        _sourceController = sourceController;
    }

    [HttpPost("stop")]
    public async Task<IActionResult> Stop()
    {
        _stateService.CurrentState = SystemState.Idle;
        await _sourceController.SwitchTo(DataSource.None);
        return Ok();
    }
    
    [HttpPost("live")]
    public async Task<IActionResult> Live()
    {
        _stateService.CurrentState = SystemState.Live;
        await _sourceController.SwitchTo(DataSource.Csv);
        return Ok();
    }
    
    [HttpPost("replay/{id}")]
    public async Task<IActionResult> Replay(string id)
    {
        _stateService.ActiveReplaySessionId = id;
        _stateService.CurrentState = SystemState.Replay;
        await _sourceController.SwitchTo(DataSource.Influx);
        Console.WriteLine("PLAYING REPLAY " + id);
        return Ok();
    }
}