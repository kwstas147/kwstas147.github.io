# ΕΚΠΑ Exercise - Οδηγίες Προσθήκης Υλικού

## 📋 Τι Χρειάζεται

Για την άσκηση από το eLearning ΕΚΠΑ, χρειάζεστε:

### 1. **Βίντεο (Storyboard2.wmv)**
   - Μετατρέψτε το WMV σε MP4 για καλύτερη συμβατότητα με browsers
   - Προτείνεται: HandBrake, FFmpeg, ή online converter (π.χ. CloudConvert)

### 2. **Εικόνες**
   - `Screenshot 2026-01-10 131248.png` (Technical Drawing)
   - `View1.png` (3D Render)

---

## 📁 Δομή Φακέλων

### Δημιουργήστε τους φακέλους:

```
assets/
  ├── videos/
  │   └── Storyboard2.mp4 (ή .wmv)
  └── images/
      └── fusion360/
          ├── ekpa-pulley-view1-400w.jpg
          ├── ekpa-pulley-view1-800w.jpg
          ├── ekpa-pulley-view1-1200w.jpg
          ├── ekpa-pulley-screenshot-400w.jpg
          ├── ekpa-pulley-screenshot-800w.jpg
          └── ekpa-pulley-screenshot-1200w.jpg
```

---

## 🎬 Βήμα 1: Μετατροπή & Τοποθέτηση Βίντεο

### Μετατροπή WMV → MP4 (Προτείνεται)

**Με HandBrake (Εύκολη μέθοδος):**
1. Κάντε download το HandBrake: https://handbrake.fr/
2. Άνοιξτε το `Storyboard2.wmv`
3. Preset: **Web > Gmail Large 3 Minutes 720p30**
4. Export ως: `Storyboard2.mp4`
5. Τοποθετήστε στο: `assets/videos/Storyboard2.mp4`

**Με FFmpeg (Command Line):**
```bash
ffmpeg -i Storyboard2.wmv -c:v libx264 -c:a aac -b:v 2M -b:a 192k Storyboard2.mp4
```

**Αν δεν μετατρέψετε:**
- Το βίντεο θα λειτουργεί μόνο σε Internet Explorer/Edge (παλιές εκδόσεις)
- Προτείνεται έντονα η μετατροπή σε MP4

---

## 🖼️ Βήμα 2: Προετοιμασία Εικόνων

### Εικόνα 1: View1.png (3D Render)

Χρησιμοποιήστε το `optimize_images.py` script ή Squoosh.app:

**Με Squoosh (Online - Προτείνεται):**
1. Άνοιξτε: https://squoosh.app/
2. Upload το `View1.png`
3. Δημιουργήστε 3 εκδόσεις:
   - **ekpa-pulley-view1-400w.jpg**: Resize → 400px, MozJPEG → Quality 85
   - **ekpa-pulley-view1-800w.jpg**: Resize → 800px, MozJPEG → Quality 85
   - **ekpa-pulley-view1-1200w.jpg**: Resize → 1200px, MozJPEG → Quality 85

**Με Python Script:**
```bash
python optimize_images.py "C:\Path\To\View1.png" "assets\images\fusion360" "ekpa-pulley-view1"
```

### Εικόνα 2: Screenshot 2026-01-10 131248.png (Technical Drawing)

Ίδια διαδικασία:
- **ekpa-pulley-screenshot-400w.jpg**
- **ekpa-pulley-screenshot-800w.jpg**
- **ekpa-pulley-screenshot-1200w.jpg**

---

## 📝 Βήμα 3: Ενημέρωση HTML (Έγινε αυτόματα!)

Το HTML έχει ήδη ενημερωθεί στο `design.html`. Αν θέλετε να αλλάξετε paths:

1. Άνοιξτε `design.html`
2. Βρείτε το "Design Project 6 - ΕΚΠΑ Exercise"
3. Ενημερώστε τα paths αν χρειάζεται

---

## ✅ Checklist

Μετά την προετοιμασία:

### Βίντεο:
- [ ] Μετατροπή WMV → MP4 (προτείνεται)
- [ ] Αρχείο `Storyboard2.mp4` στον φάκελο `assets/videos/`
- [ ] Αν δεν μετατρέψετε, βεβαιωθείτε ότι το `Storyboard2.wmv` είναι στον φάκελο `assets/videos/`

### Εικόνες:
- [ ] `ekpa-pulley-view1-400w.jpg`
- [ ] `ekpa-pulley-view1-800w.jpg`
- [ ] `ekpa-pulley-view1-1200w.jpg`
- [ ] `ekpa-pulley-screenshot-400w.jpg`
- [ ] `ekpa-pulley-screenshot-800w.jpg`
- [ ] `ekpa-pulley-screenshot-1200w.jpg`
- [ ] Όλα στον φάκελο `assets/images/fusion360/`

### Translations:
- [ ] Μεταφράσεις προστέθηκαν αυτόματα (EL & EN)

---

## 🎯 Τελική Δομή

```
assets/
  ├── videos/                          ← ΝΕΟΣ ΦΑΚΕΛΟΣ
  │   └── Storyboard2.mp4
  └── images/
      └── fusion360/
          ├── ekpa-pulley-view1-400w.jpg
          ├── ekpa-pulley-view1-800w.jpg
          ├── ekpa-pulley-view1-1200w.jpg
          ├── ekpa-pulley-screenshot-400w.jpg
          ├── ekpa-pulley-screenshot-800w.jpg
          └── ekpa-pulley-screenshot-1200w.jpg
```

---

## 🔧 Troubleshooting

### Βίντεο δεν παίζει:
1. Ελέγξτε ότι το αρχείο είναι στον φάκελο `assets/videos/`
2. Ελέγξτε το όνομα αρχείου (case-sensitive): `Storyboard2.mp4` ή `Storyboard2.wmv`
3. Προτιμήστε MP4 format για καλύτερη συμβατότητα
4. Ελέγξτε το browser console για errors (F12)

### Εικόνες δεν εμφανίζονται:
1. Ελέγξτε τα paths στο HTML
2. Ελέγξτε τα ονόματα αρχείων (case-sensitive)
3. Βεβαιωθείτε ότι οι εικόνες είναι στον φάκελο `assets/images/fusion360/`

### Play button δεν λειτουργεί:
1. Ελέγξτε το browser console (F12) για JavaScript errors
2. Βεβαιωθείτε ότι το `image-lightbox.js` φορτώνεται
3. Ελέγξτε ότι το βίντεο υπάρχει στον σωστό φάκελο

---

## 📚 Περισσότερες Πληροφορίες

- Για γενικές οδηγίες εικόνων: `README.md`
- Για optimization scripts: `optimize_images.py`
- Για quick start: `../3d-printing/QUICK_START.md`

---

## 🎨 Χρήση

Μόλις προσθέσετε τα αρχεία:
1. Το βίντεο θα εμφανίζεται με thumbnail
2. Κλικ στο thumbnail ή στο play button για αναπαραγωγή
3. Οι εικόνες θα ανοίγουν σε lightbox με zoom functionality
4. Το project θα είναι διαθέσιμο στα Ελληνικά και Αγγλικά
