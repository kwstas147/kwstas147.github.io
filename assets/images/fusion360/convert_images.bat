@echo off
:: Υποστήριξη Ελληνικών στο CMD
chcp 65001 >nul
title Fusion360 Image Converter Launcher

echo ========================================
echo    Images Converter
echo ========================================
echo.

:: Έλεγχος Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Η Python δεν βρέθηκε στο σύστημα!
    echo Παρακαλώ εγκαταστήστε την από: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Έλεγχος Pillow
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Εγκατάσταση της βιβλιοθήκης Pillow...
    pip install Pillow
    if errorlevel 1 (
        echo [ERROR] Αποτυχία εγκατάστασης της Pillow.
        pause
        exit /b 1
    )
)

:: Εκτέλεση του Python script
:: Το %~dp0 εξασφαλίζει ότι θα βρει το .py στον ίδιο φάκελο με το .bat
python "%~dp0optimize_images.py"

echo.
echo Η διαδικασία τελείωσε.
pause