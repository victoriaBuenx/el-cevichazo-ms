using ElCevichazo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using ElCevichazo.Application.Auth.Interfaces;
using ElCevichazo.Infrastructure.Repositories;
using ElCevichazo.Infrastructure.Services;
using ElCevichazo.Application.Interfaces;
using ElCevichazo.Application.Auth.UseCases;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddScoped<LoginUseCase>();
builder.Services.AddScoped<RegisterUseCase>();

builder.Services.AddControllers();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
