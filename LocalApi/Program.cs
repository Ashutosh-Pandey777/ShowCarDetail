using System.Text;
using LocalApi.Data;
using LocalApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

string cs;

if (!string.IsNullOrWhiteSpace(databaseUrl))
{
    var uri = new Uri(databaseUrl);

    var userInfo = uri.UserInfo.Split(':', 2);

    if (userInfo.Length != 2)
    {
        throw new InvalidOperationException(
            "DATABASE_URL format is invalid."
        );
    }

    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = Uri.UnescapeDataString(userInfo[1]);

    var databaseName = uri.AbsolutePath.TrimStart('/');

    // Render PostgreSQL normally uses port 5432
    var port = uri.Port > 0 ? uri.Port : 5432;

    cs =
        $"Host={uri.Host};" +
        $"Port={port};" +
        $"Database={databaseName};" +
        $"Username={username};" +
        $"Password={password};" +
        "SSL Mode=Require;" +
        "Trust Server Certificate=true;";
}
else
{
    cs = builder.Configuration.GetConnectionString("DefaultConnection")
         ?? throw new InvalidOperationException(
             "DefaultConnection is not configured."
         );
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(cs));


builder.Services.AddScoped<JwtService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key is not configured."
    );
}

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();

app.UseStaticFiles();


// Swagger only in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await db.Database.EnsureCreatedAsync();

    // Create default admin if no users exist
    if (!db.Users.Any())
    {
        db.Users.Add(
            new LocalApi.Models.AppUser
            {
                Id = Guid.NewGuid(),
                Email = "admin@local.com",
                PasswordHash = PasswordService.Hash("Admin@123"),
                Role = "admin",
                CreatedDate = DateTime.UtcNow
            }
        );

        await db.SaveChangesAsync();
    }
}
app.Run();
