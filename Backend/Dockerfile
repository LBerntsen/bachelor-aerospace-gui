FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Backend.sln", "./"]
COPY ["API/API.csproj", "API/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]

RUN dotnet restore "Backend.sln"

COPY . .

WORKDIR "/src/API"
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]