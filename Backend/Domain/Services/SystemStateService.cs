namespace Domain.Services;

public enum SystemState
{
    Idle,
    Live, 
    Replay
}

public class SystemStateService
{
    private SystemState _currentState = SystemState.Idle;
    
    public event Action<SystemState>? OnStateChanged;

    public SystemState CurrentState
    {
        get => _currentState;
        set
        {
            if (_currentState != value)
            {
                _currentState = value;
                OnStateChanged?.Invoke(_currentState);
            }
        }
    }

    public string? ActiveReplaySessionId { get; set; }
}