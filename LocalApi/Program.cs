using System.Text;
using LocalApi.Data;
using LocalApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Use the configured SQL Server connection string.
// Local development uses appsettings.json; MonsterASP should override it
// with ConnectionStrings__DefaultConnection in its application settings.
var cs = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(cs))
{
    throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection is not configured."
    );
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(cs));

builder.Services.AddScoped<JwtService>();
builder.Services.AddHttpClient<Msg91OtpService>();

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
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    status = "API is running",
    message = "Welcome To ShowCarDetail"
}));

// Create the database if it does not exist and safely add the phone field
// to an existing SQL Server Users table without deleting existing data.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await db.Database.EnsureCreatedAsync();

    await db.Database.ExecuteSqlRawAsync("""
        IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL
           AND COL_LENGTH(N'dbo.Users', N'PhoneNumber') IS NULL
        BEGIN
            ALTER TABLE dbo.Users ADD PhoneNumber nvarchar(20) NULL;
        END;

        IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL
           AND NOT EXISTS (
               SELECT 1
               FROM sys.indexes
               WHERE name = N'IX_Users_PhoneNumber'
                 AND object_id = OBJECT_ID(N'dbo.Users')
           )
        BEGIN
            CREATE UNIQUE INDEX IX_Users_PhoneNumber
            ON dbo.Users (PhoneNumber)
            WHERE PhoneNumber IS NOT NULL;
        END;
        """);

    if (!await db.Users.AnyAsync())
    {
        db.Users.Add(new LocalApi.Models.AppUser
        {
            Id = Guid.NewGuid(),
            Email = "admin@local.com",
            PasswordHash = PasswordService.Hash("Admin@123"),
            Role = "admin",
            CreatedDate = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }
}

app.Run();
