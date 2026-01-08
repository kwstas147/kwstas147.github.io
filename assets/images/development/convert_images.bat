@echo off
REM Batch script για μετατροπή εικόνων development projects
REM Χρήση: Απλά τρέξτε αυτό το αρχείο (double-click)

echo ========================================
echo Development Images Converter
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python δεν βρέθηκε!
    echo.
    echo Παρακαλώ εγκαταστήστε Python από: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [OK] Python βρέθηκε!
echo.

REM Check if Pillow is installed
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Εγκατάσταση Pillow library...
    pip install Pillow
    if errorlevel 1 (
        echo [ERROR] Αποτυχία εγκατάστασης Pillow
        pause
        exit /b 1
    )
)

echo [OK] Pillow library εγκατεστημένο!
echo.

REM Get input folder
set /p INPUT_FOLDER="Βάλτε το path του folder με τις εικόνες σας (π.χ. C:\MyImages): "

if not exist "%INPUT_FOLDER%" (
    echo [ERROR] Το folder δεν υπάρχει: %INPUT_FOLDER%
    pause
    exit /b 1
)

REM Set output folder (relative to project root)
set OUTPUT_FOLDER=assets\images\development

REM Get project root (parent of assets folder)
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..\..\..

REM Change to project root
cd /d "%PROJECT_ROOT%"

echo.
echo [INFO] Μετατροπή εικόνων...
echo Input: %INPUT_FOLDER%
echo Output: %OUTPUT_FOLDER%
echo.

REM Run Python script (uses local script)
python "%SCRIPT_DIR%optimize_images.py" "%INPUT_FOLDER%" "%OUTPUT_FOLDER%"

if errorlevel 1 (
    echo.
    echo [ERROR] Η μετατροπή απέτυχε!
    pause
    exit /b 1
)

echo.
echo ========================================
echo [SUCCESS] Ολοκληρώθηκε!
echo ========================================
echo.
echo Τα αρχεία βρίσκονται στο: %OUTPUT_FOLDER%
echo.
pause
