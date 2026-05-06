using API.Controllers;
using Domain.DTOs;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace Infrastructure.Tests.Controllers;

public class CommandControllerTests
{
    private readonly ICommandService _mockCommandService;
    private readonly CommandController _controller;

    public CommandControllerTests()
    {
        _mockCommandService = Substitute.For<ICommandService>();
        _controller = new CommandController(_mockCommandService);
    }

    [Fact]
    public async Task SendCommand_ValidId_ReturnsOk()
    {
        var expectedResponse = new CommandResponseDto(true, 200, "Success");
        _mockCommandService.SendCommandByIdAsync(123).Returns(expectedResponse);

        var result = await _controller.SendCommand("123") as ObjectResult;

        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
        Assert.Equal(expectedResponse, result.Value);
    }

    [Fact]
    public async Task SendCommand_InvalidStrign_ReturnsBadRequest()
    {
        var result = await _controller.SendCommand("abc") as ObjectResult;
        
        Assert.Equal(400, result.StatusCode);
        
        await _mockCommandService.DidNotReceiveWithAnyArgs().SendCommandByIdAsync(Arg.Any<int>());
    }
}