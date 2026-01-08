# Πώς να Προσθέσεις Εικόνες σε 3D Printing ή Fusion360

## Γρήγορη Οδηγία

### Βήμα 1: Προετοιμασία Εικόνων

**Επιλογή A: Με Batch Script (Προτείνεται)**
1. Βάλτε τις εικόνες σας σε ένα folder (π.χ. `C:\MyImages\`)
2. Double-click το `convert_images.bat` από τον αντίστοιχο folder:
   - **Για 3D Printing:** `assets/images/3d-printing/convert_images.bat`
   - **Για Fusion360:** `assets/images/fusion360/convert_images.bat`
3. Όταν σας ζητήσει path, βάλτε: `C:\MyImages\` (ή όπου έχετε τις εικόνες)
4. Πατάτε Enter και περιμένετε!

**Επιλογή B: Με Terminal**
```bash
# Για 3D Printing
python assets\images\3d-printing\optimize_images.py "C:\MyImages" "assets\images\3d-printing"

# Για Fusion360
python assets\images\fusion360\optimize_images.py "C:\MyImages" "assets\images\fusion360"
```

**Επιλογή C: Με Squoosh (Online)**
1. Άνοιξε: https://squoosh.app/
2. Upload κάθε εικόνα και δημιούργησε 3 εκδόσεις (400w, 800w, 1200w)
3. Βάλτε τα στο `assets/images/3d-printing/` ή `assets/images/fusion360/`

---

### Βήμα 2: Προσθήκη στο HTML

#### Για 3D Printing:

1. Άνοιξε `3d-printing.html`
2. Βρες το placeholder project card
3. Αντικατάστησε με:

```html
<div class="bg-card rounded-lg p-6 project-card">
    <div class="aspect-video bg-tertiary rounded mb-4 overflow-hidden relative">
        <img 
            src="assets/images/3d-printing/your-project-800w.jpg" 
            srcset="assets/images/3d-printing/your-project-400w.jpg 400w,
                    assets/images/3d-printing/your-project-800w.jpg 800w,
                    assets/images/3d-printing/your-project-1200w.jpg 1200w"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt="Description of your 3D printed project" 
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
    <h3 class="text-xl font-bold mb-2 text-blue-400">Your Project Name</h3>
    <p class="text-gray-400 text-sm mb-4">Description of your project...</p>
    <div class="flex flex-wrap gap-2">
        <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">PLA</span>
        <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">2024</span>
    </div>
</div>
```

**Σημαντικό:** Άλλαξε:
- `your-project` → όνομα του project σου (π.χ. `vase-blue-pla`)
- `Your Project Name` → όνομα project
- `Description...` → περιγραφή
- Tags (`PLA`, `2024`) → τα tags σου

#### Για Fusion360:

1. Άνοιξε `fusion360.html`
2. Βρες το placeholder project card
3. Αντικατάστησε με:

```html
<div class="bg-card rounded-lg p-6 project-card">
    <div class="aspect-video bg-tertiary rounded mb-4 overflow-hidden relative">
        <img 
            src="assets/images/fusion360/your-design-800w.jpg" 
            srcset="assets/images/fusion360/your-design-400w.jpg 400w,
                    assets/images/fusion360/your-design-800w.jpg 800w,
                    assets/images/fusion360/your-design-1200w.jpg 1200w"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt="Description of your Fusion360 design" 
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
    <h3 class="text-xl font-bold mb-2 text-blue-400">Your Design Name</h3>
    <p class="text-gray-400 text-sm mb-4">Description of your design...</p>
    <div class="flex flex-wrap gap-2">
        <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">Fusion360</span>
        <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">2024</span>
    </div>
</div>
```

**Σημαντικό:** Άλλαξε:
- `your-design` → όνομα του design σου (π.χ. `bracket-design`, `gearbox-model`)
- `Your Design Name` → όνομα design
- `Description...` → περιγραφή

---

### Βήμα 3: Προσθήκη Περισσότερων Projects

Αν θέλεις να προσθέσεις περισσότερα projects, απλά αντιγράψε το project card και βάλτε το μετά το προηγούμενο. Κάθε card είναι ένα project.

---

## Συνοπτική Επαλήθευση

- [ ] Εικόνες optimized (400w, 800w, 1200w)
- [ ] Αρχεία στο σωστό folder (`3d-printing` ή `fusion360`)
- [ ] HTML ενημερωμένο με σωστά paths
- [ ] Ονόματα projects/designs αλλάχτηκαν
- [ ] Περιγραφές προστέθηκαν
- [ ] Tags ενημερώθηκαν

---

## Παραδείγματα Ονομάτων Αρχείων

**Για 3D Printing:**
- `vase-blue-pla-400w.jpg`
- `phone-stand-black-400w.jpg`
- `robot-toy-red-400w.jpg`

**Για Fusion360:**
- `bracket-design-400w.jpg`
- `gearbox-model-400w.jpg`
- `enclosure-case-400w.jpg`

---

## Troubleshooting

**Εικόνες δεν εμφανίζονται:**
- Ελέγξτε το path στο HTML (πρέπει να είναι `assets/images/3d-printing/` ή `assets/images/fusion360/`)
- Ελέγξτε ότι τα ονόματα αρχείων είναι σωστά (case-sensitive)

**Script δεν δουλεύει:**
- Ελέγξτε ότι Python είναι εγκατεστημένο: `python --version`
- Εγκαταστήστε Pillow: `pip install Pillow`

---

## Περισσότερες Πληροφορίες

- Για 3D Printing: `assets/images/3d-printing/README.md`
- Για Fusion360: `assets/images/fusion360/README.md`
- Για Development: `assets/images/development/README.md`
