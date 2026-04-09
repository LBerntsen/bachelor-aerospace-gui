export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function isOperator()
{
    const appMode = import.meta.env.VITE_APP_MODE;
    return appMode === "operator";
}

export function isSponsor()
{
    return !isOperator();
}