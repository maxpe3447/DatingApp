FROM mcr.microsoft.com/dotnet/sdk:8.0 as build-env

WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/sdk:8.0 as final-env
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "DatingApp.dll" ]