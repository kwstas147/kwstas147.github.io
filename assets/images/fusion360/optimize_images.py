#!/usr/bin/env python3
"""
Script για αυτόματη βελτιστοποίηση εικόνων για Fusion360 Gallery

Χρήση:
    python optimize_images.py input-folder output-folder

Παράδειγμα:
    python optimize_images.py C:\Documents\fusion360 assets\images\fusion360
"""

import os
import sys
from PIL import Image

def optimize_image(input_path, output_base_name, output_dir):
    """Βελτιστοποιεί μια εικόνα σε 3 μεγέθη"""
    try:
        # Άνοιγμα αρχικής εικόνας
        img = Image.open(input_path)
        
        # Μετατροπή σε RGB αν είναι RGBA (για JPEG)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Μεγέθη για responsive images
        sizes = [
            (400, '400w'),
            (800, '800w'),
            (1200, '1200w')
        ]
        
        results = []
        
        for width, suffix in sizes:
            # Calculate height maintaining aspect ratio
            aspect_ratio = img.height / img.width
            height = int(width * aspect_ratio)
            
            # Resize με high-quality resampling
            resized = img.resize((width, height), Image.Resampling.LANCZOS)
            
            # Output filename
            output_name = f"{output_base_name}-{suffix}.jpg"
            output_path = os.path.join(output_dir, output_name)
            
            # Save με optimization
            resized.save(
                output_path,
                'JPEG',
                quality=85,
                optimize=True,
                progressive=True
            )
            
            # Get file size
            file_size = os.path.getsize(output_path)
            file_size_kb = file_size / 1024
            
            results.append({
                'name': output_name,
                'size_kb': file_size_kb,
                'dimensions': f"{width}x{height}"
            })
            
            print(f"  ✓ Created {output_name} ({width}x{height}, {file_size_kb:.1f} KB)")
        
        return results
        
    except Exception as e:
        print(f"  ✗ Error processing {input_path}: {str(e)}")
        return None

def main():
    if len(sys.argv) < 3:
        print("Χρήση: python optimize_images.py <input-folder> <output-folder>")
        print("\nΠαράδειγμα:")
        print("  python optimize_images.py C:\\Documents\\fusion360 assets\\images\\fusion360")
        sys.exit(1)
    
    input_folder = sys.argv[1]
    output_folder = sys.argv[2]
    
    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Supported image formats
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')
    
    # Find all images in input folder
    image_files = [
        f for f in os.listdir(input_folder)
        if f.lower().endswith(supported_formats)
    ]
    
    if not image_files:
        print(f"Δεν βρέθηκαν εικόνες στο {input_folder}")
        sys.exit(1)
    
    print(f"Βρέθηκαν {len(image_files)} εικόνες για επεξεργασία...\n")
    
    # Process each image
    for image_file in image_files:
        input_path = os.path.join(input_folder, image_file)
        
        # Create base name (without extension)
        base_name = os.path.splitext(image_file)[0]
        # Clean name (remove spaces, special chars)
        base_name = base_name.lower().replace(' ', '-').replace('_', '-')
        # Keep only alphanumeric and hyphens
        base_name = ''.join(c for c in base_name if c.isalnum() or c == '-')
        
        print(f"Επεξεργασία: {image_file} → {base_name}")
        
        results = optimize_image(input_path, base_name, output_folder)
        
        if results:
            total_size = sum(r['size_kb'] for r in results)
            print(f"  Σύνολο: {total_size:.1f} KB\n")
    
    print("Ολοκληρώθηκε!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nΕπανέλεγχος από τον χρήστη.")
        sys.exit(0)
    except ImportError:
        print("\nΛείπει το Pillow library.")
        print("Εγκαταστήστε το με: pip install Pillow")
        sys.exit(1)
