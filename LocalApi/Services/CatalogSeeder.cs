using System.Text.Json;
using System.Text.Json.Nodes;
using LocalApi.Data;
using LocalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LocalApi.Services;

public static class CatalogSeeder
{
    private sealed record VehicleSeed(
        string EntityType, string Name, string Brand, decimal Price,
        string BodyType, string FuelType, string Engine, string Mileage,
        string Power, string Torque, string Transmission, string ImageUrl,
        string Description);

    public static async Task SeedAsync(AppDbContext db)
    {
        var seeds = new[]
        {
            // Popular new cars. Prices are indicative Delhi ex-showroom starting prices (INR).
            new VehicleSeed("Car", "Wagon R", "Maruti Suzuki", 500000m, "Hatchback", "Petrol", "998-1197 cc", "Approx. 24 kmpl", "Up to 90.9 PS", "Up to 113 Nm", "Manual / AMT", "https://www.varunmaruti.com/uploads/products/colors/wagonr-poolside-blue.png", "Popular tall-boy hatchback for everyday city use."),
            new VehicleSeed("Car", "Brezza", "Maruti Suzuki", 755000m, "SUV", "Petrol", "1462 cc", "Approx. 19.8 kmpl", "103.1 PS", "136.8 Nm", "Manual / Automatic", "https://cdn-s3.autocarindia.com/Maruti-Suzuki/Brezza/maruti-suzuki_2026%20brezza.jpg", "Compact SUV with petrol and CNG options."),
            new VehicleSeed("Car", "Nexon", "Tata", 740000m, "Compact SUV", "Petrol", "1199 cc", "Variant dependent", "Variant dependent", "Variant dependent", "Manual / Automatic", "https://c.ndtvimg.com/2026-02/bmg3m4jc_tata-nexon_625x300_10_February_26.jpg?im=FaceCrop%2Calgorithm%3Ddnn%2Cwidth%3D1200%2Cheight%3D800", "Compact SUV available with petrol, diesel and electric powertrains."),
            new VehicleSeed("Car", "Baleno", "Maruti Suzuki", 600000m, "Hatchback", "Petrol", "1197 cc", "Approx. 22.3 kmpl", "90.0 PS", "113 Nm", "Manual / AMT", "https://c.ndtvimg.com/2026-09/gahn193_2026-maruti-suzuki-baleno_625x300_10_September_26.png?im=FitAndFill%2Calgorithm%3Ddnn%2Cwidth%3D1600%2Cheight%3D900", "Premium hatchback with spacious cabin and petrol or CNG options."),
            new VehicleSeed("Car", "Dzire", "Maruti Suzuki", 634000m, "Compact Sedan", "Petrol", "1197 cc", "Approx. 24.8 kmpl", "82 PS", "112 Nm", "Manual / AMT", "https://www.marutisuzuki.com/adobe/assets/urn%3Aaaid%3Aaem%3A48213e02-33ab-4eca-b553-413e4bd126d3/as/Dzire_360_Red00008.png?height=1080&width=1920", "Compact sedan designed for daily commuting and family use."),
            new VehicleSeed("Car", "Ertiga", "Maruti Suzuki", 895000m, "MUV", "Petrol", "1462 cc", "Approx. 20.5 kmpl", "103.1 PS", "136.8 Nm", "Manual / Automatic", "", "Seven-seat family MUV with petrol and CNG options."),
            new VehicleSeed("Car", "Punch", "Tata", 575000m, "SUV", "Petrol", "1199 cc", "Variant dependent", "Variant dependent", "Variant dependent", "Manual / AMT", "https://asset.autocarindia.com/static/image-galleries/images/20260109_110635_f81e560b.png", "Compact SUV with petrol, CNG and electric variants in the Punch range."),
            new VehicleSeed("Car", "Fronx", "Maruti Suzuki", 695000m, "Compact SUV", "Petrol", "998-1197 cc", "Variant dependent", "Variant dependent", "Variant dependent", "Manual / Automatic", "https://v3cars.com/media/model-imgs/274157fronx-banner.png", "Sporty crossover with naturally aspirated and turbo-petrol options."),
            new VehicleSeed("Car", "Scorpio-N", "Mahindra", 1369000m, "SUV", "Petrol", "1997-2198 cc", "Variant dependent", "Variant dependent", "Variant dependent", "Manual / Automatic", "https://www.wheels42.com/images/cars/1401974167Silver.jpg", "Body-on-frame SUV offered with petrol and diesel engines."),
            new VehicleSeed("Car", "Swift", "Maruti Suzuki", 584000m, "Hatchback", "Petrol", "1197 cc", "Approx. 24.8 kmpl", "82 PS", "112 Nm", "Manual / AMT", "https://www.v3cars.com/media/model-imgs/900669prime-luster-blus.webp", "Popular compact hatchback for city and highway driving."),

            // Additional popular motorcycles; existing five bike seeds remain untouched.
            new VehicleSeed("Bike", "Xtreme 125R", "Hero", 96700m, "Street", "Petrol", "124.7 cc", "Approx. 63 kmpl", "11.4 bhp", "10.5 Nm", "5-speed manual", "https://www.heromotocorp.com/content/dam/hero-aem-website/bd/en-bd/products/xtreme-125r/12.png", "Sporty 125cc commuter with LED lighting and a 5-speed gearbox."),
            new VehicleSeed("Bike", "Pulsar N160", "Bajaj", 122974m, "Street", "Petrol", "164.82 cc", "Approx. 51.6 kmpl", "16 PS", "14.65 Nm", "5-speed manual", "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https%3A%2F%2Fcms.haymarketindia.net%2Fmodel%2Fuploads%2Fmodelimages%2FBajaj-Pulsar-N160-040720221312.png", "Street motorcycle with a 160cc-class engine and ABS variants."),
            new VehicleSeed("Bike", "Apache RTR 160 4V", "TVS", 119981m, "Street", "Petrol", "159.7 cc", "Approx. 47 kmpl", "17.55 PS", "14.73 Nm", "5-speed manual", "https://media.zigcdn.com/media/model/2026/Mar/side-profile-view-right-304531249_930x620.jpg", "Sporty 160cc motorcycle with four-valve engine technology."),
            new VehicleSeed("Bike", "MT-15 V2", "Yamaha", 168708m, "Street", "Petrol", "155 cc", "Approx. 56 kmpl", "18.4 PS", "14.1 Nm", "6-speed manual", "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/mt_series/mt15v2/color/color_06.webp", "Lightweight streetfighter with a liquid-cooled 155cc engine."),
            new VehicleSeed("Bike", "Hunter 350", "Royal Enfield", 149900m, "Roadster", "Petrol", "349 cc", "Approx. 36 kmpl", "20.2 PS", "27 Nm", "5-speed manual", "https://www.royalenfield.co.jp/images/lineup/hunter/colors/front-view.png", "Urban roadster powered by Royal Enfield's 349cc J-series engine."),
            new VehicleSeed("Bike", "Shine 125", "Honda", 80409m, "Commuter", "Petrol", "123.94 cc", "Approx. 55 kmpl", "10.6 bhp", "11 Nm", "5-speed manual", "https://bikeadvice.in/wp-content/uploads/2025/02/2025-Honda-Shine-125-1-1200x778.jpg", "Practical 125cc commuter motorcycle for daily riding.")
        };

        var existingRows = await db.EntityRecords
            .Where(x => x.EntityType == "Car" || x.EntityType == "Bike")
            .ToListAsync();

        foreach (var seed in seeds)
        {
            var exists = existingRows.Any(row =>
            {
                if (!string.Equals(row.EntityType, seed.EntityType, StringComparison.OrdinalIgnoreCase)) return false;
                try
                {
                    using var doc = JsonDocument.Parse(row.Data);
                    var root = doc.RootElement;
                    return root.TryGetProperty("name", out var n)
                        && root.TryGetProperty("brand", out var b)
                        && string.Equals(n.GetString(), seed.Name, StringComparison.OrdinalIgnoreCase)
                        && string.Equals(b.GetString(), seed.Brand, StringComparison.OrdinalIgnoreCase);
                }
                catch { return false; }
            });

            if (exists) continue;

            var now = DateTime.UtcNow;
            var data = new
            {
                name = seed.Name,
                brand = seed.Brand,
                brand_slug = Slug(seed.Brand),
                condition = "New",
                price = seed.Price,
                price_note = "Indicative starting ex-showroom price in Delhi, INR; verify the current variant and city price before purchase.",
                body_type = seed.BodyType,
                fuel_type = seed.FuelType,
                engine = seed.Engine,
                mileage = seed.Mileage,
                max_power = seed.Power,
                power = seed.Power,
                torque = seed.Torque,
                transmission = seed.Transmission,
                image_url = seed.ImageUrl,
                gallery = Array.Empty<string>(),
                description = seed.Description,
                is_featured = true,
                is_popular = true,
                is_upcoming = false,
                active = true,
                category = seed.EntityType
            };

            db.EntityRecords.Add(new EntityRecord
            {
                Id = Guid.NewGuid(),
                EntityType = seed.EntityType,
                Data = JsonSerializer.Serialize(data),
                CreatedDate = now,
                UpdatedDate = now
            });
        }

        // Add the car brands used by the starter car catalogue, with editable logo URLs.
        var carBrands = new[]
        {
            ("Maruti Suzuki", "India", "https://www.marutisuzuki.com"),
            ("Tata", "India", "https://www.tatamotors.com"),
            ("Mahindra", "India", "https://www.mahindra.com"),
            ("Hyundai", "South Korea", "https://www.hyundai.com"),
            ("Kia", "South Korea", "https://www.kia.com"),
            ("Toyota", "Japan", "https://www.toyotabharat.com")
        };

        var brandRows = await db.EntityRecords.Where(x => x.EntityType == "Brand").ToListAsync();
        foreach (var brand in carBrands)
        {
            var row = brandRows.FirstOrDefault(x =>
            {
                try
                {
                    var node = JsonNode.Parse(x.Data);
                    return string.Equals((string?)node?["name"], brand.Item1, StringComparison.OrdinalIgnoreCase)
                        && !string.Equals((string?)node?["category"], "Bike", StringComparison.OrdinalIgnoreCase);
                }
                catch { return false; }
            });

            if (row is null)
            {
                var now = DateTime.UtcNow;
                var brandData = new JsonObject
                {
                    ["name"] = brand.Item1,
                    ["slug"] = Slug(brand.Item1),
                    ["country"] = brand.Item2,
                    ["website"] = brand.Item3,
                    ["category"] = "Car",
                    ["image_url"] = Favicon(brand.Item3),
                    ["description"] = brand.Item1 + " passenger vehicle brand"
                };
                db.EntityRecords.Add(new EntityRecord
                {
                    Id = Guid.NewGuid(),
                    EntityType = "Brand",
                    Data = brandData.ToJsonString(),
                    CreatedDate = now,
                    UpdatedDate = now
                });
            }
            else
            {
                var node = JsonNode.Parse(row.Data)?.AsObject();
                if (node is not null && string.IsNullOrWhiteSpace((string?)node["image_url"]))
                {
                    node["image_url"] = Favicon(brand.Item3);
                    row.Data = node.ToJsonString();
                    row.UpdatedDate = DateTime.UtcNow;
                }
            }
        }

        // Existing bike brand records also get a usable logo/favicon when they have none.
        foreach (var row in brandRows)
        {
            try
            {
                var node = JsonNode.Parse(row.Data)?.AsObject();
                if (node is null || !string.Equals((string?)node["category"], "Bike", StringComparison.OrdinalIgnoreCase)) continue;
                if (!string.IsNullOrWhiteSpace((string?)node["image_url"])) continue;
                var website = (string?)node["website"];
                if (string.IsNullOrWhiteSpace(website)) continue;
                node["image_url"] = Favicon(website);
                row.Data = node.ToJsonString();
                row.UpdatedDate = DateTime.UtcNow;
            }
            catch { }
        }

        foreach (var entry in db.ChangeTracker.Entries<EntityRecord>().Where(e => e.State == EntityState.Added && e.Entity.EntityType == "Brand"))
        {
            try
            {
                var node = JsonNode.Parse(entry.Entity.Data)?.AsObject();
                if (node is null || !string.Equals((string?)node["category"], "Bike", StringComparison.OrdinalIgnoreCase)) continue;
                if (!string.IsNullOrWhiteSpace((string?)node["image_url"])) continue;
                var website = (string?)node["website"];
                if (!string.IsNullOrWhiteSpace(website)) node["image_url"] = Favicon(website);
                entry.Entity.Data = node.ToJsonString();
            }
            catch { }
        }

        await db.SaveChangesAsync();
    }

    private static string Slug(string value) =>
        string.Join("-", value.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries));

    private static string Favicon(string website) =>
        "https://www.google.com/s2/favicons?domain=" + Uri.EscapeDataString(website) + "&sz=128";
}
