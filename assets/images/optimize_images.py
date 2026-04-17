#!/usr/bin/env python3
"""
Script για αυτόματη βελτιστοποίηση εικόνων για Μετατροπη!.
Υποστηρίζει αυτόματη ανίχνευση φακέλου και καθαρισμό ονομάτων αρχείων.
"""

import os
import sys
from PIL import Image

def optimize_image(input_path, output_base_name, output_dir):
    """Βελτιστοποιεί μια εικόνα σε 3 μεγέθη (400w, 800w, 1200w)"""
    try:
        img = Image.open(input_path)
        
        # Μετατροπή σε RGB αν είναι RGBA/Transparent για συμβατότητα με JPEG
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            mask = img.split()[-1] if img.mode == 'RGBA' else None
            background.paste(img, mask=mask)
            img = background
        
        # Μεγέθη για responsive images
        sizes = [(400, '400w'), (800, '800w'), (1200, '1200w')]
        
        for width, suffix in sizes:
            # Διατήρηση aspect ratio
            aspect_ratio = img.height / img.width
            height = int(width * aspect_ratio)
            
            # Resize με υψηλή ποιότητα
            resized = img.resize((width, height), Image.Resampling.LANCZOS)
            
            output_name = f"{output_base_name}-{suffix}.jpg"
            target_path = os.path.join(output_dir, output_name)
            
            # Αποθήκευση με βελτιστοποίηση
            resized.save(
                target_path,
                'JPEG',
                quality=85,
                optimize=True,
                progressive=True
            )
            
            file_size_kb = os.path.getsize(target_path) / 1024
            print(f"  ✓ Δημιουργήθηκε: {output_name} ({file_size_kb:.1f} KB)")
            
        return True
    except Exception as e:
        print(f"  ✗ Σφάλμα στην επεξεργασία του αρχείου {input_path}: {e}")
        return False

def main():
    # Εύρεση του φακέλου στον οποίο είναι αποθηκευμένο το script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("========================================")
    print("    Image Optimizer Tool")
    print("========================================\n")

    # 1. Λήψη φακέλου εισόδου
    print("Βήμα 1: Φάκελος με τις αρχικές εικόνες")
    user_input = input(f"[Πατήστε ENTER για: {script_dir}]: ").strip()
    
    # Καθαρισμός εισαγωγικών (σε περίπτωση copy-path από Windows)
    user_input = user_input.replace('"', '').replace("'", "")
    
    input_folder = user_input if user_input else script_dir

    if not os.path.exists(input_folder):
        print(f"\n[ERROR] Η διαδρομή δεν βρέθηκε: {input_folder}")
        input("\nΠιέστε ENTER για έξοδο...")
        return

    # 2. Λήψη φακέλου εξόδου
    print("\nΒήμα 2: Φάκελος αποθήκευσης")
    default_output = os.path.join(input_folder, "optimized_assets")
    user_output = input(f"[Πατήστε ENTER για: {default_output}]: ").strip()
    user_output = user_output.replace('"', '').replace("'", "")
    
    output_folder = user_output if user_output else default_output

    # Δημιουργία φακέλου εξόδου αν δεν υπάρχει
    os.makedirs(output_folder, exist_ok=True)

    # Αναζήτηση υποστηριζόμενων αρχείων
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')
    image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(supported_formats)]

    if not image_files:
        print(f"\n[!] Δεν βρέθηκαν εικόνες στον φάκελο: {input_folder}")
        input("\nΠιέστε ENTER για έξοδο...")
        return

    print(f"\n[OK] Βρέθηκαν {len(image_files)} εικόνες. Έναρξη εργασίας...\n")

    processed_count = 0
    for file_name in image_files:
        input_path = os.path.join(input_folder, file_name)
        
        # Καθαρισμός ονόματος (SEO friendly)
        base_name = os.path.splitext(file_name)[0].lower().replace(' ', '-').replace('_', '-')
        base_name = ''.join(c for c in base_name if c.isalnum() or c == '-')
        
        print(f"Επεξεργασία: {file_name}")
        if optimize_image(input_path, base_name, output_folder):
            processed_count += 1
            print("-" * 30)

    print("\n========================================")
    print(f"ΟΛΟΚΛΗΡΩΘΗΚΕ ΕΠΙΤΥΧΩΣ!")
    print(f"Επεξεργάστηκαν: {processed_count} αρχεία.")
    print(f"Τοποθεσία: {output_folder}")
    print("========================================")
    
    input("\nΠιέστε ENTER για να κλείσετε το παράθυρο...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nΗ διαδικασία διακόπηκε από τον χρήστη.")
        sys.exit(0)
    except Exception as e:
        print(f"\nΚρίσιμο σφάλμα: {e}")
        input("\nΠιέστε ENTER για έξοδο...")
        sys.exit(1)