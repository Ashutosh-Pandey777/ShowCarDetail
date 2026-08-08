# ShowCarDetail — Base44 -> Local

This package removes the Base44 SDK/backend dependency and replaces it with a local React + ASP.NET Core 8 + SQL Server backend.

## Run

### Terminal 1 — API
```cmd
cd LocalApi
dotnet restore
dotnet run
```
API: http://localhost:5050
Swagger: http://localhost:5050/swagger

### Terminal 2 — React
```cmd
npm install
npm run dev
```
Website: http://localhost:5173

Or double-click `START-LOCAL.bat` after .NET and Node are installed.

## Default admin
Email: `admin@local.com`
Password: `Admin@123`

## Database
Default is SQL Server LocalDB:
`(localdb)\\MSSQLLocalDB`
Database name: `ShowCarDetailLocal`

Change `LocalApi/appsettings.json` if you use SQL Server Express/Developer.

## What was converted
- Base44 entity CRUD -> `/api/entities/{entity}`
- Base44 email/password auth -> JWT auth
- Base44 file upload -> local `LocalApi/wwwroot/uploads`
- Admin CRUD for cars, brands, reviews, news and gallery
- Public contact and visit creation
- React Base44 SDK calls -> local API client
- Base44 authentication bootstrap -> local auth context
- Admin route now requires `role=admin`
- Google login/OTP email/password-reset email are not configured locally

## Important limitation
The deleted Base44 application's hosted database cannot be recovered from the exported ZIP. Entity schemas and UI code were present, so a new local database is created. Add your old cars/brands/images again through the local admin dashboard.
