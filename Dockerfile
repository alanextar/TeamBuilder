#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /app

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

COPY *.sln .
COPY TeamBuilder/*.csproj ./TeamBuilder/
RUN dotnet restore 

COPY TeamBuilder/. ./TeamBuilder/
WORKDIR /app/TeamBuilder
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS runtime
WORKDIR /app
COPY --from=build /app/TeamBuilder/out ./

CMD ASPNETCORE_URLS=http://*:$PORT dotnet TeamBuilder.dll