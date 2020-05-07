REM - This file assumes that you have access to the application and that you have docker installed
REM : Setup your applications name below
SET APP_NAME="TeamBuilder"

REM - Delete all files and folders in publish
del /q ".\bin\Release\netcoreapp3.1\publish\*"
FOR /D %%p IN (".\bin\Release\netcoreapp3.1\publish\*.*") DO rmdir "%%p" /s /q

dotnet clean --configuration Release
dotnet publish -c Release
copy Dockerfile .\bin\Release\netcoreapp3.1\publish\
cd .\bin\Release\netcoreapp3.1\publish\
call heroku container:login
call heroku container:push web -a vk-team-builder
call heroku container:release web -a vk-team-builder