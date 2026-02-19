@echo off
REM Batch script για μετατροπή εικόνων development projects
REM Χρήση: Απλά τρέξτε αυτό το αρχείο (double-click)

echo ========================================
echo Development Images Converter
echo ========================================
echo.

REM Έλεγχος αν υπάρχει η Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python δεν βρέθηκε!
    echo Παρακαλώ εγκαταστήστε Python από: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python βρέθηκε!

REM Έλεγχος αν υπάρχει η βιβλιοθήκη Pillow
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

REM Ζήτηση φακέλου εισόδου από τον χρήστη
set /p INPUT_FOLDER="Βάλτε το path του folder με τις εικόνες σας (π.χ. C:\MyImages): "

if not exist "%INPUT_FOLDER%" (
    echo [ERROR] Το folder δεν υπάρχει: %INPUT_FOLDER%
    pause
    exit /b 1
)

---
### Ορισμός φακέλου εξόδου στον τρέχοντα κατάλογο του script
---
set SCRIPT_DIR=%~dp0
REM Ορίζουμε το OUTPUT_FOLDER να είναι ο φάκελος του script
set OUTPUT_FOLDER=%SCRIPT_DIR%converted

echo.
echo [INFO] Μετατροπή εικόνων...
echo Input:  "%INPUT_FOLDER%"
echo Output: "%OUTPUT_FOLDER%"
echo.

REM Εκτέλεση του Python script (υποθέτοντας ότι το optimize_images.py είναι στον ίδιο φάκελο)
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
echo Τα αρχεία αποθηκεύτηκαν εδώ: %OUTPUT_FOLDER%
echo.
pause