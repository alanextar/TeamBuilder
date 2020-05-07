#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
COPY . .

CMD ASPNETCORE_URLS=http://*:$PORT dotnet TeamBuilder.dll
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install --yes nodejs