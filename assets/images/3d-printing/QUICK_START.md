# Quick Start Guide - Προετοιμασία Εικόνων

## Fast Track (Γρήγορη Μέθοδος)

### Με Squoosh (Προτείνεται - Δωρεάν Online)

1. Άνοιξε: https://squoosh.app/
2. Upload την εικόνα σου
3. **Για κάθε μέγεθος:**
   - Resize → Width: **1200** (ή 800, ή 400)
   - Compress → MozJPEG → Quality: **85**
   - Enable: **Optimize**
   - Download
4. Ονόμασε τα αρχεία: `project-name-400w.jpg`, `project-name-800w.jpg`, `project-name-1200w.jpg`
5. Βάλτα στο folder: `assets/images/3d-printing/`

### Με Python Script (Αυτόματη)

```bash
# 1. Εγκατάσταση (μια φορά)
pip install Pillow

# 2. Run script
python assets/images/3d-printing/optimize_images.py "C:\Your\Images\Folder" "assets\images\3d-printing"
```

## Τι Χρειάζεται για Κάθε Project

✅ **3 εκδόσεις:**
- `project-name-400w.jpg` (~50-100 KB)
- `project-name-800w.jpg` (~150-250 KB)  
- `project-name-1200w.jpg` (~300-500 KB)

✅ **Συνολικό μέγεθος:** < 850 KB ανά project

## Checklist

- [ ] 3 εκδόσεις (400w, 800w, 1200w)
- [ ] JPEG format (.jpg)
- [ ] Quality: 80-85%
- [ ] Περιγραφικά ονόματα αρχείων
- [ ] Files στο `assets/images/3d-printing/`
- [ ] File sizes εντός ορίων

## Προσθήκη στο HTML

Αντέγραψε το template από το `3d-printing.html` και άλλαξε:
- `project-name` → όνομα του project σου
- `alt` text → περιγραφή
- `h3` title → όνομα project
- Tags (PLA, 2024, κτλ)

## Tools Summary

| Tool | Εύκολη Χρήση | Batch Processing | Auto Optimization |
|------|-------------|------------------|-------------------|
| **Squoosh** | ⭐⭐⭐⭐⭐ | ❌ | ✅ |
| **TinyPNG** | ⭐⭐⭐⭐ | ✅ (20 files) | ✅ |
| **GIMP** | ⭐⭐⭐ | ❌ | ❌ |
| **Python Script** | ⭐⭐⭐⭐ | ✅ | ✅ |

## Tips

💡 **Γρήγορο Tip:** Αν έχετε πολλές εικόνες, χρησιμοποιήστε το Python script

💡 **Quality Balance:** 80-85% quality είναι η καλύτερη ισορροπία

💡 **Naming:** Χρησιμοποιήστε lowercase, hyphens: `vase-blue-pla-400w.jpg`

💡 **File Size:** Αν το file είναι >500KB για 1200w, μειώστε quality στα 80%
