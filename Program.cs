magnetrievee/
├── src/
│   └── ...
├── public/
├── control-service/
│   ├── MagnetrieveControl.csproj
│   ├── Program.cs
│   ├── RobotState.cs
│   ├── RobotController.cs
│   └── appsettings.json
├── package.json
└── README.md

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        message = "Magnetrieve C# Control Service is running!"
    });
});

app.MapGet("/api/robot/status", () =>
{
    return Results.Ok(new
    {
        status = "online",
        battery = 100,
        movement = "stopped",
        magnet = false
    });
});

app.MapPost("/api/robot/move/{direction}", (string direction) =>
{
    return Results.Ok(new
    {
        message = $"Robot moving {direction}"
    });
});

app.MapPost("/api/robot/stop", () =>
{
    return Results.Ok(new
    {
        message = "Robot stopped"
    });
});

app.MapPost("/api/robot/magnet/{state}", (string state) =>
{
    return Results.Ok(new
    {
        message = $"Magnet turned {state}"
    });
});

app.Run();
