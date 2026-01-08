# Γρήγορη Οδηγία - Μετατροπή 3 Εικόνων

## Μέθοδος 1: Με Squoosh (Προτείνεται - Γρήγορη)

### Βήμα 1: Άνοιξε Squoosh
Πήγαινε στο: **https://squoosh.app/**

### Βήμα 2: Για κάθε εικόνα (3 φορές)

**Για την 1η εικόνα:**
1. Upload την εικόνα σου
2. **Για 400w:**
   - Resize → Width: **400**
   - Compress → MozJPEG → Quality: **85**
   - Enable: **Optimize**
   - Download → Ονόμασε: `project1-400w.jpg`
3. **Για 800w:**
   - Resize → Width: **800**
   - Compress → MozJPEG → Quality: **85**
   - Enable: **Optimize**
   - Download → Ονόμασε: `project1-800w.jpg`
4. **Για 1200w:**
   - Resize → Width: **1200**
   - Compress → MozJPEG → Quality: **85**
   - Enable: **Optimize**
   - Download → Ονόμασε: `project1-1200w.jpg`

**Επαναλάβετε για 2η και 3η εικόνα** (project2, project3)

### Βήμα 3: Βάλτε τα αρχεία
Μεταφέρετε όλα τα αρχεία στο folder:
```
assets/images/development/
```

Θα έχετε συνολικά **9 αρχεία** (3 projects × 3 μεγέθη):
- `project1-400w.jpg`, `project1-800w.jpg`, `project1-1200w.jpg`
- `project2-400w.jpg`, `project2-800w.jpg`, `project2-1200w.jpg`
- `project3-400w.jpg`, `project3-800w.jpg`, `project3-1200w.jpg`

---

## Μέθοδος 2: Με Python Script (Αυτόματη)

### Αν έχετε Python εγκατεστημένο:

1. **Βάλτε τις 3 αρχικές εικόνες σε ένα folder** (π.χ. `C:\MyImages\`)

2. **Εγκαταστήστε Pillow** (μια φορά):
```bash
pip install Pillow
```

3. **Run το script:**
```bash
python assets/images/development/optimize_images.py "C:\MyImages" "assets\images\development"
```

Το script θα δημιουργήσει αυτόματα όλα τα 9 αρχεία!

---

## Προσθήκη στο HTML

Αφού έχετε τα αρχεία, ανοίξτε το `programming.html` και βρείτε τα placeholder project cards. Αντικαταστήστε με:

```html
<div class="bg-card rounded-lg p-6 project-card">
    <div class="aspect-video bg-tertiary rounded mb-4 overflow-hidden relative">
        <img 
            src="assets/images/development/project1-800w.jpg" 
            srcset="assets/images/development/project1-400w.jpg 400w,
                    assets/images/development/project1-800w.jpg 800w,
                    assets/images/development/project1-1200w.jpg 1200w"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt="Description of your project" 
            class="w-full h-full object-cover lazy-image"
            loading="lazy"
            width="800"
            height="450"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="absolute inset-0 bg-tertiary rounded flex items-center justify-center" style="display: none;">
            <i data-lucide="image" class="w-12 h-12 text-slate-500"></i>
        </div>
    </div>
    <h3 class="text-xl font-bold mb-2 text-blue-400">Project Name</h3>
    <p class="text-gray-400 text-sm mb-4">Description...</p>
</div>
```

---

## Συμβουλές

✅ **Ονόματα αρχείων:** Χρησιμοποιήστε περιγραφικά ονόματα (π.χ. `flutter-app`, `csharp-tool`, `web-dashboard`)

✅ **File Size Targets:**
- 400w: < 100KB
- 800w: < 250KB
- 1200w: < 500KB

✅ **Quality:** 80-85% είναι η καλύτερη ισορροπία

✅ **Format:** JPEG (.jpg) για screenshots

---

## Επαλήθευση

Μετά την προετοιμασία, ελέγξτε:
- [ ] 9 αρχεία συνολικά (3 projects × 3 μεγέθη)
- [ ] Όλα τα αρχεία στο `assets/images/development/`
- [ ] File sizes εντός ορίων
- [ ] Η ποιότητα είναι καλή

---

## Troubleshooting

**Εικόνα δεν εμφανίζεται:**
- Ελέγξτε το path (πρέπει να είναι `assets/images/development/`)
- Ελέγξτε τα ονόματα αρχείων (case-sensitive)

**File size πολύ μεγάλο:**
- Μειώστε quality στα 80%
- Ελέγξτε το πραγματικό μέγεθος (width) της εικόνας

**Εικόνα blurry:**
- Αυξήστε quality στα 85-90%
- Ελέγξτε ότι χρησιμοποιείτε την σωστή έκδοση (1200w για desktop)
