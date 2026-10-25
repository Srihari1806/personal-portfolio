@echo off
REM ---------------------------------------------------------------------------
REM  Srihari Beesetti - portfolio
REM  Double-click this file to start the site. It installs dependencies the
REM  first time, then opens http://localhost:8080 in your browser.
REM  Close this window (or press Ctrl+C) to stop the server.
REM ---------------------------------------------------------------------------

setlocal
cd /d "%~dp0"

title Srihari Beesetti - portfolio

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found on your PATH.
  echo   Install it from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

REM This repo is managed with bun ^(bun.lock^), so prefer bun when it is
REM available. Falling back to npm, we skip the lockfile so a stray
REM package-lock.json never ends up committed alongside bun.lock.
set "PKG=npm"
where bun >nul 2>nul
if not errorlevel 1 set "PKG=bun"

if not exist "node_modules" (
  echo.
  echo   Installing dependencies with %PKG%. This only happens once...
  echo.
  if "%PKG%"=="bun" (
    call bun install
  ) else (
    call npm install --no-package-lock --no-audit --no-fund
  )
  if errorlevel 1 (
    echo.
    echo   Dependency install failed. Scroll up for the reason.
    echo.
    pause
    exit /b 1
  )
)

echo.
echo   Starting the portfolio on http://localhost:8080
echo   Leave this window open while you work. Press Ctrl+C to stop.
echo.

call %PKG% run start

REM Only reached if the server exits or fails to boot.
echo.
echo   The server has stopped.
echo.
pause
