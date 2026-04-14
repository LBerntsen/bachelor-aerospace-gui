namespace Domain.DTOs;

public record CommandResponseDto(bool isSuccess, int code, string message);