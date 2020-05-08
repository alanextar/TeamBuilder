REM - This file assumes that you have access to the application and that you have docker installed
REM : Setup your applications name below
SET APP_NAME="TeamBuilder"
SET ReleasePath=.\bin\Release\netcoreapp3.1\publish\

CALL :CleanPublish %ReleasePath%
CALL :Rebuild
CALL :PublishContainer %ReleasePath%
EXIT /B %ERRORLEVEL%

:CleanPublish
del /q %~1
FOR /D %%p IN (%~1"*.*") DO rmdir "%%p" /s /q
EXIT /B 0

:Rebuild
dotnet clean -c Release
dotnet publish -c Release
EXIT /B 0

:PublishContainer
copy Dockerfile %~1
cd %~1

call heroku container:login
call heroku container:push web -a vk-team-builder
call heroku container:release web -a vk-team-builder

cd ..\..\..\..
EXIT /B 0