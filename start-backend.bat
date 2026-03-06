@echo off
echo Starting F1 Fantasy backend...
cd /d "%~dp0..\..\F1 fantasy\f1-fantasy-backend"
uvicorn main:app --reload --host 0.0.0.0
pause
