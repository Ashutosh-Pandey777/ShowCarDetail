# ShowCarDetail - Base44 to Local Conversion

## Requirements
- .NET 8 SDK
- SQL Server LocalDB (installed with Visual Studio) OR edit `LocalApi/appsettings.json` to point to your SQL Server instance
- Node.js 20/22 LTS

## First run
1. Open a terminal in this folder.
2. Run `dotnet --version` and `node --version`.
3. Run `dotnet run --project LocalApi`.
4. The API creates the `ShowCarDetailLocal` database automatically with EF Core `EnsureCreated`.
5. In another terminal run `npm install`.
6. Run `npm run dev`.
7. Open http://localhost:5173

## Default admin
- Email: `admin@local.com`
- Password: `Admin@123`

Change the password after first login. The admin dashboard can create/edit/delete Cars, Brands, Reviews, News and Gallery images. Gallery uploads are stored in `LocalApi/wwwroot/uploads`.

## SQL Server connection
Default connection uses:
`(localdb)\\MSSQLLocalDB`

For a normal SQL Server instance, edit `LocalApi/appsettings.json`, for example:
`Server=localhost;Database=ShowCarDetailLocal;Trusted_Connection=True;TrustServerCertificate=True;`

## Important
The original Base44 project was deleted, so its old hosted database/data cannot be recovered from this ZIP. The ZIP contains the entity schemas and frontend, so this conversion creates a new local database. You will need to add your cars/brands/images again through the admin dashboard.

Google login and email OTP/password-reset email are intentionally not configured in local mode. Email/password login is fully local.
