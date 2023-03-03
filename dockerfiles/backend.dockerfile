FROM mcr.microsoft.com/dotnet/aspnet:5.0  AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0  AS build
WORKDIR /src
COPY ["../backend/backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"
COPY ../backend .
WORKDIR "/src/backend"
RUN dotnet build "backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]