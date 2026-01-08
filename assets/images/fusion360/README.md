# Fusion360 Images - Οδηγίες

## Γρήγορη Μετατροπή Εικόνων

Έχετε **2 επιλογές** για να μετατρέψετε τις εικόνες σας στα 3 μεγέθη:

---

## 🚀 Μέθοδος 1: Με Squoosh (Προτείνεται - Online)

### Βήματα:

1. **Άνοιξε:** https://squoosh.app/

2. **Για κάθε εικόνα:**
   - Upload την εικόνα
   - **400w:** Resize → 400px, MozJPEG → Quality 85, Download
   - **800w:** Resize → 800px, MozJPEG → Quality 85, Download  
   - **1200w:** Resize → 1200px, MozJPEG → Quality 85, Download

3. **Ονόματα αρχείων:**
   - `design1-400w.jpg`, `design1-800w.jpg`, `design1-1200w.jpg`
   - `design2-400w.jpg`, `design2-800w.jpg`, `design2-1200w.jpg`
   - κτλ.

4. **Βάλτε τα στο:** `assets/images/fusion360/`

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
python assets/images/fusion360/optimize_images.py "C:\Path\To\Your\Images" "assets\images\fusion360"
```

**Χρόνος:** ~1-2 λεπτά για 3 εικόνες

---

## 📋 Τι Χρειάζεται

Για κάθε design, **3 εκδόσεις:**
- **400w** → ~50-100 KB (mobile)
- **800w** → ~150-250 KB (tablet)
- **1200w** → ~300-500 KB (desktop/retina)

---

## 📝 Προσθήκη στο HTML

Αφού έχετε τα αρχεία, ανοίξτε το `fusion360.html` και βρείτε τα placeholder cards. 

**Παράδειγμα:**
```html
<img 
    src="assets/images/fusion360/design1-800w.jpg" 
    srcset="assets/images/fusion360/design1-400w.jpg 400w,
            assets/images/fusion360/design1-800w.jpg 800w,
            assets/images/fusion360/design1-1200w.jpg 1200w"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt="Your design description" 
    class="w-full h-full object-cover lazy-image"
    loading="lazy"
    width="800"
    height="450"
>
```

---

## ✅ Checklist

Μετά την προετοιμασία:
- [ ] 3 εκδόσεις για κάθε design (400w, 800w, 1200w)
- [ ] Όλα στο `assets/images/fusion360/`
- [ ] File sizes εντός ορίων
- [ ] Περιγραφικά ονόματα (π.χ. `bracket-design`, `gearbox-model`)
- [ ] Quality 80-85%

---

## 🔧 Troubleshooting

**Python script δεν δουλεύει:**
- Ελέγξτε ότι Python είναι εγκατεστημένο: `python --version`
- Εγκαταστήστε Pillow: `pip install Pillow`

**Εικόνα δεν εμφανίζεται:**
- Ελέγξτε το path (πρέπει να είναι `assets/images/fusion360/`)
- Ελέγξτε τα ονόματα αρχείων (case-sensitive)

**File size πολύ μεγάλο:**
- Μειώστε quality στα 80%
- Ελέγξτε το πραγματικό μέγεθος (width)

---

## 📚 Περισσότερες Πληροφορίες

Για πιο λεπτομερείς οδηγίες, δείτε:
- `../3d-printing/README.md` - Πλήρης οδηγός με όλες τις λεπτομέρειες
