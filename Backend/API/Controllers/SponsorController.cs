using API.Attributes;
using Domain.Models;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[SponsorOnly]
[ApiController]
[Route("api/[controller]")]
public class SponsorController : ControllerBase
{
    private readonly InfluxDbRepository _repository;

    public SponsorController(InfluxDbRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("live")]
    public async Task<IActionResult> GetSponsorData([FromQuery] int? secondsBack)
    {
        try
        {
            if (secondsBack.HasValue)
            {
                List<SensorData> recentData = await _repository.PollRecentDataAsync(secondsBack.Value);
                return Ok(recentData);
            }

            List<SensorData> allSessionData = await _repository.GetCurrentSessionDataAsync();
            return Ok(allSessionData);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Sponsor API Error: {e.Message}");
            return StatusCode(500, "Internal server error reading from database");
        }
    }
}