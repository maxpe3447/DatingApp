FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

#copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

#copy everything els and build
COPY . ./
RUN dotnet publish -c Release -o out

#build Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "DatingApp.dll"]