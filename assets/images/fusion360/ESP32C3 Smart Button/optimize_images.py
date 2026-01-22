#!/usr/bin/env python3
"""
Fusion360 Gallery Image Optimizer
----------------------------------
Αυτόματη βελτιστοποίηση εικόνων στον τρέχοντα φάκελο.
Δημιουργεί responsive εκδόσεις (400w, 800w, 1200w) σε μορφή JPEG.
"""

import os
import sys
from PIL import Image

def optimize_image(input_path, output_base_name, output_dir):
    """
    Βελτιστοποιεί μια εικόνα σε 3 μεγέθη (Responsive Design).
    """
    try:
        img = Image.open(input_path)
        
        # Μετατροπή σε RGB για συμβατότητα με JPEG (αφαίρεση transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            mask = img.split()[-1] if img.mode == 'RGBA' else None
            background.paste(img, mask=mask)
            img = background
        
        # Ορισμός μεγεθών για responsive images
        sizes = [
            (400, '400w'),
            (800, '800w'),
            (1200, '1200w')
        ]
        
        results = []
        
        for width, suffix in sizes:
            # Διατήρηση Aspect Ratio
            aspect_ratio = img.height / img.width
            height = int(width * aspect_ratio)
            
            # Resize με LANCZOS resampling (High Quality)
            resized = img.resize((width, height), Image.Resampling.LANCZOS)
            
            output_name = f"{output_base_name}-{suffix}.jpg"
            output_path = os.path.join(output_dir, output_name)
            
            # Αποθήκευση με Web Optimization
            resized.save(
                output_path,
                'JPEG',
                quality=85,
                optimize=True,
                progressive=True
            )
            
            file_size_kb = os.path.getsize(output_path) / 1024
            results.append({
                'name': output_name,
                'size_kb': file_size_kb,
                'dimensions': f"{width}x{height}"
            })
            
            print(f"  ✓ Δημιουργήθηκε: {output_name} ({width}x{height}, {file_size_kb:.1f} KB)")
        
        return results
        
    except Exception as e:
        print(f"  ✗ Σφάλμα επεξεργασίας {input_path}: {str(e)}")
        return None

def main():
    # Καθορισμός φακέλου βάσει της τοποθεσίας του script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    
    # Αν δοθούν ορίσματα από terminal χρησιμοποιούνται αυτά, αλλιώς ο τρέχων φάκελος
    input_folder = sys.argv[1] if len(sys.argv) > 1 else script_dir
    output_folder = sys.argv[2] if len(sys.argv) > 2 else os.path.join(script_dir, "optimized_assets")
    
    # Δημιουργία φακέλου εξόδου
    os.makedirs(output_folder, exist_ok=True)
    
    # Υποστηριζόμενα formats
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')
    
    # Φιλτράρισμα αρχείων
    image_files = [
        f for f in os.listdir(input_folder)
        if f.lower().endswith(supported_formats)
    ]
    
    if not image_files:
        print(f"Ειδοποίηση: Δεν βρέθηκαν εικόνες προς επεξεργασία στο: {input_folder}")
        return

    print(f"--- Έναρξη Βελτιστοποίησης ---")
    print(f"Φάκελος Εισόδου: {input_folder}")
    print(f"Φάκελος Εξόδου: {output_folder}")
    print(f"Σύνολο αρχείων: {len(image_files)}\n")
    
    for image_file in image_files:
        input_path = os.path.join(input_folder, image_file)
        
        # Καθαρισμός ονόματος (SEO Friendly)
        base_name = os.path.splitext(image_file)[0]
        base_name = base_name.lower().replace(' ', '-').replace('_', '-')
        base_name = ''.join(c for c in base_name if c.isalnum() or c == '-')
        
        print(f"Επεξεργασία: {image_file}")
        results = optimize_image(input_path, base_name, output_folder)
        
        if results:
            total_size = sum(r['size_kb'] for r in results)
            print(f"  Ολοκληρώθηκε: {base_name} (Συνολικό βάρος: {total_size:.1f} KB)\n")

    print("-" * 30)
    print("Η διαδικασία ολοκληρώθηκε επιτυχώς!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nΗ διαδικασία διακόπηκε από τον χρήστη.")
        sys.exit(0)
    except ImportError:
        print("\nΣφάλμα: Η βιβλιοθήκη Pillow δεν είναι εγκατεστημένη.")
        print("Εγκατάσταση: pip install Pillow")
        sys.exit(1)