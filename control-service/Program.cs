using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDashboard", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowDashboard");

// Robot state
var robot = new RobotState();

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        message = "Magnetrieve C# Control Service is running!",
        status = "online"
    });
});

// Get current robot status
app.MapGet("/api/robot/status", () =>
{
    return Results.Ok(robot);
});

// Move the robot
app.MapPost("/api/robot/move/{direction}", (string direction) =>
{
    direction = direction.ToLower();

    string[] validDirections =
    {
        "forward",
        "backward",
        "left",
        "right",
        "stop"
    };

    if (!validDirections.Contains(direction))
    {
        return Results.BadRequest(new
        {
            message = "Invalid movement command."
        });
    }

    robot.Movement = direction;

    return Results.Ok(new
    {
        message = $"Robot moving {direction}.",
        movement = robot.Movement
    });
});

// Turn electromagnet on/off
app.MapPost("/api/robot/magnet/{state}", (string state) =>
{
    state = state.ToLower();

    if (state != "on" && state != "off")
    {
        return Results.BadRequest(new
        {
            message = "Magnet state must be 'on' or 'off'."
        });
    }

    robot.ElectromagnetOn = state == "on";

    return Results.Ok(new
    {
        message = $"Electromagnet turned {state}.",
        magnet = robot.ElectromagnetOn
    });
});

// Control robot arm
app.MapPost("/api/robot/arm/{position}", (string position) =>
{
    position = position.ToLower();

    if (position != "raised" && position != "lowered")
    {
        return Results.BadRequest(new
        {
            message = "Arm position must be 'raised' or 'lowered'."
        });
    }

    robot.ArmPosition = position;

    return Results.Ok(new
    {
        message = $"Robot arm {position}.",
        arm = robot.ArmPosition
    });
});

// Emergency stop
app.MapPost("/api/robot/stop", () =>
{
    robot.Movement = "stop";
    robot.ElectromagnetOn = false;

    return Results.Ok(new
    {
        message = "EMERGENCY STOP ACTIVATED.",
        movement = robot.Movement,
        magnet = robot.ElectromagnetOn
    });
});

// Simulate metal detection
app.MapPost("/api/robot/sensor/metal/{detected}", (bool detected) =>
{
    robot.MetalDetected = detected;

    return Results.Ok(new
    {
        message = detected
            ? "Metal detected."
            : "No metal detected.",
        metalDetected = robot.MetalDetected
    });
});

app.Run();


// Robot state model
public class RobotState
{
    public string Status { get; set; } = "Online";

    public int Battery { get; set; } = 100;

    public string Movement { get; set; } = "stop";

    public bool MetalDetected { get; set; } = false;

    public bool ElectromagnetOn { get; set; } = false;

    public string ArmPosition { get; set; } = "raised";

    public int ObjectsCollected { get; set; } = 0;
}
