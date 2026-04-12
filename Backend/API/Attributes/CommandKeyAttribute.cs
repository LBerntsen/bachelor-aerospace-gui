using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Attributes;

public class CommandKeyAttribute : Attribute, IAsyncActionFilter
{
    private const string CommandKeyHeaderName = "X-Operator-Command-Key";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var expectedCommandKey = configuration["CommandKey"];

        if (!context.HttpContext.Request.Headers.TryGetValue(CommandKeyHeaderName, out var extractedCommandKey) ||
            expectedCommandKey != extractedCommandKey)
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Unauthorized: Wrong or missing command key!"
            };
            return;
        }

        await next();
    }
}