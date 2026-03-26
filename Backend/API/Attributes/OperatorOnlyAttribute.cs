using API.Extensions;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace API.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class OperatorOnlyAttribute : Attribute, IActionConstraint
{
    public int Order => 0;

    public bool Accept(ActionConstraintContext context)
    {
        return context.RouteContext.HttpContext.RequestServices.GetRequiredService<IConfiguration>().IsOperatorMode();
    }
}