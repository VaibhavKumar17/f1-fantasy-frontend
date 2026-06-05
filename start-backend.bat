@echo off
echo Starting F1 Fantasy backend...
cd /d "%~dp0..\..\F1 fantasy\risk-engine"
uvicorn main:app --reload --reload-exclude "*.db" --reload-exclude "*.db-journal" --reload-exclude "*.db-wal" --reload-exclude "*.db-shm" --host 0.0.0.0
pause
