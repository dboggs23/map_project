using backend.Configuration;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var AllowSpecificOrigins = "_allowSpecificOrigins";

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowSpecificOrigins, policy =>
    {
        policy
        .WithOrigins("http://localhost:3000", "https://localhost:7046")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddDbContext<MapContext>(opt =>
    opt.UseNpgsql("Properties"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Configuration.AddEnvironmentVariables()
                     .AddUserSecrets(Assembly.GetExecutingAssembly(), true);

var databaseSecret = builder.Configuration.GetValue<string>("dbconnectionstring");
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
