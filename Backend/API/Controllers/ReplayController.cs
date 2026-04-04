using API.Attributes;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[OperatorOnly]
[ApiController]
[Route("api/[controller]")]
public class ReplayController : ControllerBase
{
    private readonly InfluxOperatorDbRepository _repository;

    public ReplayController(InfluxOperatorDbRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSessions()
    {
        var sessions = await _repository.GetSessionsAsync();
        return Ok(sessions.OrderByDescending(session => session));
    }
}