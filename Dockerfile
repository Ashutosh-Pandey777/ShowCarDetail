FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY LocalApi/LocalApi.csproj LocalApi/
RUN dotnet restore LocalApi/LocalApi.csproj

COPY LocalApi/ LocalApi/

WORKDIR /src/LocalApi

RUN dotnet publish LocalApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "LocalApi.dll"]
