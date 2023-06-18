using backend.Configuration;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var AllowSpecificOrigins = "_allowSpecificOrigins";
string databaseSecret;

string dockerEnvironment = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") ?? "false";

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowSpecificOrigins, policy =>
    {
        policy
        //.WithOrigins("http://localhost:3000", "https://localhost:7046")
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddDbContext<MapContext>(opt =>
    opt.UseNpgsql("Properties"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Configuration.AddEnvironmentVariables()
                     .AddUserSecrets(Assembly.GetExecutingAssembly(), true);

if (dockerEnvironment == "true")
{
    builder.Configuration.AddJsonFile("/secrets/secrets.json");
    databaseSecret = builder.Configuration.GetValue<string>("dbstring");
}
else
{
    databaseSecret = builder.Configuration.GetValue<string>("dbconnectionstring");
}
AppSettings.dbConnection = databaseSecret;

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



//app.UseHttpLogging();



app.UseHttpsRedirection();

app.UseCors(AllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
