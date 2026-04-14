using Domain.DTOs;

namespace Infrastructure.Services.Interfaces;

public interface ICommandService
{
    Task<CommandResponseDto> SendCommandByIdAsync(int id);
}