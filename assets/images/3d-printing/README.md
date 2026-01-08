# Οδηγίες Προετοιμασίας Εικόνων για 3D Printing Gallery

## Προτεινόμενα Προγράμματα

### Windows
- **GIMP** (Δωρεάν): https://www.gimp.org/
- **Paint.NET** (Δωρεάν): https://www.getpaint.net/
- **XnConvert** (Δωρεάν): Batch processing για πολλαπλές εικόνες
- **ImageMagick** (Δωρεάν, Command Line): Για automation

### Online Tools
- **Squoosh** (Google): https://squoosh.app/ - Πολύ καλή συμπίεση με preview
- **TinyPNG**: https://tinypng.com/ - Αποτελεσματική συμπίεση
- **Compressor.io**: https://compressor.io/

## Προτεινόμενα Μεγέθη Εικόνων

### Για κάθε project, δημιουργήστε 3 εκδόσεις:

1. **400w** - 400px πλάτος
   - Για mobile devices
   - Προορισμός: ~50-100KB

2. **800w** - 800px πλάτος  
   - Για tablets και μικρές οθόνες
   - Προορισμός: ~150-250KB

3. **1200w** - 1200px πλάτος
   - Για desktop και retina displays
   - Προορισμός: ~300-500KB

## Οδηγίες Προετοιμασίας

### Βήμα 1: Προετοιμασία Αρχικής Εικόνας
1. Πάρτε την αρχική εικόνα από την κάμερά σας
2. Κάντε crop αν χρειάζεται για καλύτερη σύνθεση
3. Διορθώστε exposure, contrast αν χρειάζεται

### Βήμα 2: Resize (Αλλαγή Μεγέθους)

**Μέθοδος A: Με GIMP**
1. Ανοίξτε την εικόνα στο GIMP
2. Image → Scale Image
3. Ρυθμίστε το πλάτος στα 1200px (height θα αλλάξει αυτόματα)
4. Interpolation: Cubic (Best)
5. Save ως `project-name-1200w.jpg`
6. Επαναλάβετε για 800px και 400px

**Μέθοδος B: Με Squoosh (Προτείνεται)**
1. Άνοιξε https://squoosh.app/
2. Upload την εικόνα
3. Επιλέξτε MozJPEG quality: 85
4. Resize: 1200px width
5. Download ως `project-name-1200w.jpg`
6. Επαναλάβετε για 800px και 400px

**Μέθοδος C: Με ImageMagick (Command Line)**
```bash
# Windows (με ImageMagick installed)
magick input.jpg -quality 85 -resize 1200x project-name-1200w.jpg
magick input.jpg -quality 85 -resize 800x project-name-800w.jpg
magick input.jpg -quality 85 -resize 400x project-name-400w.jpg
```

### Βήμα 3: Compression (Συμπίεση)

**Προτεινόμενες Ρυθμίσεις:**
- **Format**: JPEG (.jpg)
- **Quality**: 80-85% (Ισορροπία μεταξύ ποιότητας και μεγέθους)
- **Optimize**: Ναι (Progressive JPEG αν είναι διαθέσιμο)

**Με Squoosh:**
1. Upload την resized εικόνα
2. Επιλέξτε **MozJPEG**
3. Quality: **85**
4. Enable **Optimize**
5. Download

**Με TinyPNG:**
1. Upload μέχρι 20 εικόνες τη φορά
2. Αυτόματη βελτιστοποίηση
3. Download όλες μαζί

### Βήμα 4: Ονομασία Αρχείων

Χρησιμοποιήστε περιγραφικά ονόματα:
```
project-name-400w.jpg
project-name-800w.jpg
project-name-1200w.jpg
```

**Παραδείγματα:**
- `vase-pla-blue-400w.jpg`
- `phone-stand-black-400w.jpg`
- `robot-toy-red-400w.jpg`

## Επιπλέον Συμβουλές

### 1. Aspect Ratio
- Προτείνεται: **16:9** (aspect-video)
- Αν η εικόνα σας είναι διαφορετική, το CSS θα κάνει crop στο center

### 2. Lighting & Photography
- Χρησιμοποιήστε καλό φωτισμό (φυσικό ή studio)
- Αποφύγετε σκληρές σκιές
- Καθαρό background (λευκό/γκρι) βοηθάει

### 3. File Size Targets
- **400w**: < 100KB
- **800w**: < 250KB  
- **1200w**: < 500KB
- **Σύνολο ανά project**: < 850KB

### 4. Batch Processing
Αν έχετε πολλές εικόνες, χρησιμοποιήστε:
- **XnConvert** (Windows): Batch resize & compress
- **ImageMagick** scripts για automation

## Παράδειγμα Χρήσης στον Κώδικα

```html
<img 
    src="assets/images/3d-printing/project-name-800w.jpg" 
    srcset="assets/images/3d-printing/project-name-400w.jpg 400w,
            assets/images/3d-printing/project-name-800w.jpg 800w,
            assets/images/3d-printing/project-name-1200w.jpg 1200w"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt="Description of your 3D printed project" 
    class="w-full h-full object-cover lazy-image"
    loading="lazy"
    width="800"
    height="450"
>
```

## Αυτοματοποίηση με Python Script

Αν έχετε Python εγκατεστημένο, μπορείτε να χρησιμοποιήσετε το `optimize_images.py` script για automatic optimization:

### Εγκατάσταση
```bash
pip install -r requirements.txt
```

### Χρήση
```bash
python optimize_images.py "C:\Path\To\Your\Images" "assets\images\3d-printing"
```

Το script θα:
- Δημιουργήσει αυτόματα 3 εκδόσεις (400w, 800w, 1200w)
- Κάνει resize με high-quality algorithm
- Compress με quality 85%
- Clean filenames (lowercase, hyphens)
- Εμφανίσει file sizes για κάθε έκδοση

**Παράδειγμα:**
```bash
python optimize_images.py "C:\Users\kwsta\Pictures\3D Prints" "assets\images\3d-printing"
```

## Τεχνικές Λεπτομέρειες

- **srcset**: Ο browser επιλέγει την κατάλληλη εικόνα ανάλογα με το μέγεθος οθόνης
- **sizes**: Λέει στον browser το μέγεθος που θα έχει η εικόνα στη σελίδα
- **loading="lazy"**: Φορτώνει την εικόνα μόνο όταν είναι ορατή (Lazy Loading)
- **width/height**: Βοηθάει να αποφευχθεί layout shift κατά το loading

## Verification (Επαλήθευση)

Μετά την προετοιμασία, ελέγξτε:
- [ ] Όλες οι 3 εκδόσεις (400w, 800w, 1200w) υπάρχουν
- [ ] File sizes είναι εντός των προτεινόμενων ορίων
- [ ] Η ποιότητα είναι ικανοποιητική
- [ ] Τα ονόματα αρχείων είναι συνεπή

## Troubleshooting

**Εικόνα φαίνεται blurry:**
- Αυξήστε το quality (85-90%)
- Ελέγξτε ότι χρησιμοποιείτε την σωστή έκδοση (1200w για desktop)

**File size πολύ μεγάλο:**
- Μειώστε το quality (80-85%)
- Ελέγξτε το πραγματικό μέγεθος (width) της εικόνας

**Εικόνα δεν εμφανίζεται:**
- Ελέγξτε το path του αρχείου
- Ελέγξτε ότι το όνομα αρχείου είναι σωστό (case-sensitive)
