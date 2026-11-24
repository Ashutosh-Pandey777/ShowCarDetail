using System.Text;
using System.Text.Json;
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

    // Seed an initial five-bike catalogue without overwriting existing admin data.
    var bikeSeeds = new[]
    {
        new { Name = "Splendor Plus", Brand = "Hero", Price = 78912m, Engine = "97.2 cc", Mileage = "70 kmpl (claimed)", Power = "5.9 kW @ 8,000 rpm", Torque = "8.05 Nm @ 6,000 rpm", Body = "Commuter", Transmission = "4-speed manual", Image = "https://images.hindustantimes.com/auto/img/2022/09/20/1600x900/Hero_Splendor_Plus_1_1663664170137_1663664176373_1663664176373.png", Description = "A practical 100cc commuter motorcycle known for everyday reliability, low running costs and Hero's i3S technology." },
        new { Name = "SP 125", Brand = "Honda", Price = 89748m, Engine = "123.94 cc", Mileage = "60 kmpl (claimed)", Power = "8.7 kW @ 7,500 rpm", Torque = "10.9 Nm @ 6,000 rpm", Body = "Commuter", Transmission = "5-speed manual", Image = "https://www.honda2wheelersindia.com/_next/image?dpl=dpl_3FSTbsDQCuD8mqeCp52d6jgHHJat&q=75&url=https%3A%2F%2Fedge.sitecorecloud.io%2Fhondamotorc388f-hmsi8ece-prodb777-e813%2Fmedia%2FProject%2FHONDA2WI%2Fhonda2wheelersindia%2Fmotorcycle%2Fsp-125%2Fget-to-know-your-ride%2FGet-to-know-your-ride-584x450.png%3Fh%3D450%26iar%3D0%26w%3D584&w=1200", Description = "A modern 125cc commuter with fuel injection, LED lighting, a digital instrument display and practical everyday comfort." },
        new { Name = "Raider 125", Brand = "TVS", Price = 84990m, Engine = "124.76 cc", Mileage = "56.7 kmpl (claimed)", Power = "8.3 kW @ 7,500 rpm", Torque = "11.2 Nm @ 6,000 rpm", Body = "Street", Transmission = "5-speed manual", Image = "https://www.tvsmotor.com/pe/-/media/Feature/IB/Columbia/compressed-images/virtual-experience/Virtual-Experince/Raider/yellow.png", Description = "A sporty 125cc street motorcycle with a digital cluster, sharp styling and comfortable urban handling." },
        new { Name = "Pulsar NS125", Brand = "Bajaj", Price = 99622m, Engine = "124.45 cc", Mileage = "Approx. 50 kmpl", Power = "12 PS", Torque = "11 Nm", Body = "Street", Transmission = "5-speed manual", Image = "https://cdn.cars24.com/prod/new-bike-cms/Bajaj/Pulsar-Ns125/2025/01/03/bdc23bba-eaa8-4a21-bf83-15b750da7737-Bajaj_Pulsar-Ns125_Bike-Image.png", Description = "A sporty 125cc streetfighter with muscular styling, a perimeter-style frame and confident city performance." },
        new { Name = "Classic 350", Brand = "Royal Enfield", Price = 187434m, Engine = "349 cc", Mileage = "Approx. 36 kmpl", Power = "20.2 bhp @ 6,100 rpm", Torque = "27 Nm @ 4,000 rpm", Body = "Cruiser", Transmission = "5-speed manual", Image = "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/new/rajshahi-red.png", Description = "A modern classic motorcycle powered by Royal Enfield's 349cc J-series engine, with relaxed ergonomics and retro styling." }
    };

    var existingBikeJson = await db.EntityRecords
        .Where(x => x.EntityType == "Bike")
        .Select(x => x.Data)
        .ToListAsync();

    foreach (var bike in bikeSeeds)
    {
        var alreadyExists = existingBikeJson.Any(json =>
        {
            try
            {
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;
                return root.TryGetProperty("name", out var name)
                    && root.TryGetProperty("brand", out var brand)
                    && string.Equals(name.GetString(), bike.Name, StringComparison.OrdinalIgnoreCase)
                    && string.Equals(brand.GetString(), bike.Brand, StringComparison.OrdinalIgnoreCase);
            }
            catch { return false; }
        });

        if (alreadyExists) continue;

        var now = DateTime.UtcNow;
        var data = new
        {
            name = bike.Name,
            brand = bike.Brand,
            price = bike.Price,
            price_note = "Starting ex-showroom price (indicative); city and variant may change the final price.",
            body_type = bike.Body,
            fuel_type = "Petrol",
            engine = bike.Engine,
            mileage = bike.Mileage,
            max_power = bike.Power,
            torque = bike.Torque,
            transmission = bike.Transmission,
            image_url = bike.Image,
            description = bike.Description,
            is_featured = true,
            is_popular = true,
            is_upcoming = false,
            active = true,
            category = "Bike"
        };

        db.EntityRecords.Add(new LocalApi.Models.EntityRecord
        {
            Id = Guid.NewGuid(),
            EntityType = "Bike",
            Data = JsonSerializer.Serialize(data),
            CreatedDate = now,
            UpdatedDate = now
        });
    }

    // Seed a broad two-wheeler brand directory; administrators can edit it later.
    var bikeBrandSeeds = new[]
    {
        ("Hero", "hero", "India", "https://www.heromotocorp.com"),
        ("Honda", "honda", "Japan", "https://www.honda2wheelersindia.com"),
        ("TVS", "tvs", "India", "https://www.tvsmotor.com"),
        ("Bajaj", "bajaj", "India", "https://www.bajajauto.com"),
        ("Royal Enfield", "royal-enfield", "India", "https://www.royalenfield.com"),
        ("Yamaha", "yamaha", "Japan", "https://www.yamaha-motor-india.com"),
        ("Suzuki", "suzuki", "Japan", "https://www.suzukimotorcycle.co.in"),
        ("KTM", "ktm", "Austria", "https://www.ktm.com"),
        ("Kawasaki", "kawasaki", "Japan", "https://www.kawasaki.com"),
        ("BMW Motorrad", "bmw-motorrad", "Germany", "https://www.bmw-motorrad.in"),
        ("Aprilia", "aprilia", "Italy", "https://www.aprilia.com"),
        ("Jawa", "jawa", "India", "https://www.jawamotorcycles.com"),
        ("Yezdi", "yezdi", "India", "https://www.yezdi.com"),
        ("Triumph", "triumph", "United Kingdom", "https://www.triumphmotorcycles.in"),
        ("Harley-Davidson", "harley-davidson", "USA", "https://www.harley-davidson.com"),
        ("Ducati", "ducati", "Italy", "https://www.ducati.com"),
        ("Ola Electric", "ola-electric", "India", "https://www.olaelectric.com"),
        ("Ather", "ather", "India", "https://www.atherenergy.com"),
        ("Chetak", "chetak", "India", "https://www.chetak.com"),
        ("Revolt", "revolt", "India", "https://www.revoltmotors.com"),
        ("Ultraviolette", "ultraviolette", "India", "https://www.ultraviolette.com"),
        ("Oben Electric", "oben-electric", "India", "https://www.obenelectric.com"),
        ("Matter", "matter", "India", "https://www.matter.in"),
        ("River", "river", "India", "https://www.rideriver.com"),
        ("Ampere", "ampere", "India", "https://ampere.greaveselectricmobility.com"),
        ("Vespa", "vespa", "Italy", "https://www.vespa.com"),
        ("Piaggio", "piaggio", "Italy", "https://www.piaggio.com"),
        ("BGauss", "bgauss", "India", "https://www.bgauss.com"),
        ("Simple Energy", "simple-energy", "India", "https://www.simpleenergy.in"),
        ("Vida", "vida", "India", "https://www.vidaworld.com"),
        ("Komaki", "komaki", "India", "https://www.komaki.in"),
        ("Okinawa", "okinawa", "India", "https://okinawascooters.com"),
        ("Lectrix EV", "lectrix-ev", "India", "https://www.lectrixev.com")
    };

    var existingBrandJson = await db.EntityRecords
        .Where(x => x.EntityType == "Brand")
        .Select(x => x.Data)
        .ToListAsync();

    foreach (var brand in bikeBrandSeeds)
    {
        var alreadyExists = existingBrandJson.Any(json =>
        {
            try
            {
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;
                return root.TryGetProperty("category", out var category)
                    && string.Equals(category.GetString(), "Bike", StringComparison.OrdinalIgnoreCase)
                    && root.TryGetProperty("name", out var name)
                    && string.Equals(name.GetString(), brand.Item1, StringComparison.OrdinalIgnoreCase);
            }
            catch { return false; }
        });

        if (alreadyExists) continue;

        var now = DateTime.UtcNow;
        db.EntityRecords.Add(new LocalApi.Models.EntityRecord
        {
            Id = Guid.NewGuid(),
            EntityType = "Brand",
            Data = JsonSerializer.Serialize(new
            {
                name = brand.Item1,
                slug = brand.Item2,
                country = brand.Item3,
                website = brand.Item4,
                category = "Bike",
                description = brand.Item1 + " two-wheeler brand"
            }),
            CreatedDate = now,
            UpdatedDate = now
        });
    }

    await CatalogSeeder.SeedAsync(db);
    await db.SaveChangesAsync();
}

app.Run();
