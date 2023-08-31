@echo off
REM This script drives the standalone linkcheck package, which bundles together a
REM Dart executable and a snapshot of linkcheck.

set SCRIPTPATH=%~dp0
set arguments=%*
"%SCRIPTPATH%\src\dart.exe" "%SCRIPTPATH%\src\linkcheck.snapshot" %arguments%
