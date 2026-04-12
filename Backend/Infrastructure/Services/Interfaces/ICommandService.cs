namespace Infrastructure.Services.Interfaces;

public interface ICommandService
{
    Task<bool> SendCommandByIdAsync(int id);
}