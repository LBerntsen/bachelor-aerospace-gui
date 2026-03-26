namespace API.Extensions;

public static class ConfigurationExtensions
{
    public const string OperatorMode = "Operator";
    public const string SponsorMode = "Sponsor";
    public const string ConfigKey = "AppMode";

    public static bool IsSponsorMode(this IConfiguration config)
    {
        string mode = config.GetValue<string>(ConfigKey) ?? SponsorMode;
        return string.Equals(mode, SponsorMode, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsOperatorMode(this IConfiguration configuration)
    {
        return !configuration.IsSponsorMode();
    }
}