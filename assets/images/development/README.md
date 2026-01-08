# Development Images - Οδηγίες

## Γρήγορη Μετατροπή 3 Εικόνων

Έχετε **2 επιλογές** για να μετατρέψετε τις 3 εικόνες σας στα 3 μεγέθη:

---

## 🚀 Μέθοδος 1: Με Squoosh (Προτείνεται - Online)

### Βήματα:

1. **Άνοιξε:** https://squoosh.app/

2. **Για κάθε εικόνα (3 φορές):**
   - Upload την εικόνα
   - **400w:** Resize → 400px, MozJPEG → Quality 85, Download
   - **800w:** Resize → 800px, MozJPEG → Quality 85, Download  
   - **1200w:** Resize → 1200px, MozJPEG → Quality 85, Download

3. **Ονόματα αρχείων:**
   - `project1-400w.jpg`, `project1-800w.jpg`, `project1-1200w.jpg`
   - `project2-400w.jpg`, `project2-800w.jpg`, `project2-1200w.jpg`
   - `project3-400w.jpg`, `project3-800w.jpg`, `project3-1200w.jpg`

4. **Βάλτε τα στο:** `assets/images/development/`

**Χρόνος:** ~10-15 λεπτά για 3 εικόνες

---

## ⚡ Μέθοδος 2: Με Python Script (Αυτόματη)

### Προαπαιτούμενα:
- Python 3.x εγκατεστημένο
- Pillow library

### Εγκατάσταση:
```bash
pip install Pillow
```

### Χρήση:

**Επιλογή A: Με Batch Script (Windows)**
1. Double-click το `convert_images.bat`
2. Βάλτε το path του folder με τις εικόνες σας
3. Περιμένετε!

**Επιλογή B: Με Command Line**
```bash
python assets/images/development/optimize_images.py "C:\Path\To\Your\Images" "assets\images\development"
```

**Χρόνος:** ~1-2 λεπτά για 3 εικόνες

---

## 📋 Τι Χρειάζεται

Για κάθε project, **3 εκδόσεις:**
- **400w** → ~50-100 KB (mobile)
- **800w** → ~150-250 KB (tablet)
- **1200w** → ~300-500 KB (desktop/retina)

**Σύνολο:** 9 αρχεία (3 projects × 3 μεγέθη)

---

## 📝 Προσθήκη στο HTML

Αφού έχετε τα αρχεία, ανοίξτε το `programming.html` και βρείτε τα placeholder cards. 

**Παράδειγμα:**
```html
<img 
    src="assets/images/development/project1-800w.jpg" 
    srcset="assets/images/development/project1-400w.jpg 400w,
            assets/images/development/project1-800w.jpg 800w,
            assets/images/development/project1-1200w.jpg 1200w"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt="Your project description" 
    class="w-full h-full object-cover lazy-image"
    loading="lazy"
    width="800"
    height="450"
>
```

---

## ✅ Checklist

Μετά την προετοιμασία:
- [ ] 9 αρχεία συνολικά (3 projects × 3 μεγέθη)
- [ ] Όλα στο `assets/images/development/`
- [ ] File sizes εντός ορίων
- [ ] Περιγραφικά ονόματα (π.χ. `flutter-app`, `csharp-tool`)
- [ ] Quality 80-85%

---

## 🔧 Troubleshooting

**Python script δεν δουλεύει:**
- Ελέγξτε ότι Python είναι εγκατεστημένο: `python --version`
- Εγκαταστήστε Pillow: `pip install Pillow`

**Εικόνα δεν εμφανίζεται:**
- Ελέγξτε το path (πρέπει να είναι `assets/images/development/`)
- Ελέγξτε τα ονόματα αρχείων (case-sensitive)

**File size πολύ μεγάλο:**
- Μειώστε quality στα 80%
- Ελέγξτε το πραγματικό μέγεθος (width)

---

## 📚 Περισσότερες Πληροφορίες

Για πιο λεπτομερείς οδηγίες, δείτε:
- `QUICK_GUIDE.md` - Γρήγορη αναφορά
- `../3d-printing/README.md` - Πλήρης οδηγός με όλες τις λεπτομέρειες
