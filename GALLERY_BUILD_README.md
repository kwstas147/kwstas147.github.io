# Gallery Build System - Οδηγίες

Αυτό το σύστημα επιτρέπει την αυτόματη εμφάνιση νέων εικόνων στο site χωρίς να χρειάζεται να τροποποιείτε τον κώδικα.

## Πώς λειτουργεί

1. **Προσθέστε εικόνες** στους φακέλους:
   - `assets/images/3d-printing/3d-printed parts/`
   - `assets/images/3d-printing/replica/`
   - `assets/images/3d-printing/3d-printing/`

2. **Εκτελέστε το build script** για να σκανάρετε τους φακέλους:
   ```bash
   npm run build-gallery
   ```
   ή
   ```bash
   node build-gallery.js
   ```

3. **Το script δημιουργεί** το αρχείο `assets/data/gallery-images.json` με όλες τις εικόνες

4. **Ο JavaScript φορτώνει** αυτόματα τις εικόνες από το JSON

## Απαιτήσεις για τις εικόνες

Κάθε εικόνα πρέπει να έχει **3 εκδόσεις**:
- `{timestamp}-400w.jpg` - Μικρή ανάλυση (mobile)
- `{timestamp}-800w.jpg` - Μεσαία ανάλυση (tablet)
- `{timestamp}-1200w.jpg` - Μεγάλη ανάλυση (desktop)

**Παράδειγμα:**
```
20220307-184742-400w.jpg
20220307-184742-800w.jpg
20220307-184742-1200w.jpg
```

## Workflow

1. Προσθέστε νέες εικόνες στον κατάλληλο φάκελο
2. Ενημερώστε το `assets/data/gallery-config.json` (αν χρειάζεται νέο project ή αλλαγή mapping)
3. Εκτελέστε `npm run build-gallery`
4. Commit και push τις αλλαγές (εικόνες + JSON)
5. Οι εικόνες εμφανίζονται αυτόματα στο site!

## Οργάνωση Εικόνων ανά Project

Το σύστημα υποστηρίζει οργάνωση εικόνων ανά project μέσω του `assets/data/gallery-config.json`. Κάθε project μπορεί να έχει:
- **Φάκελο με εικόνες** στον `assets/images/3d-printing/`
- **Mapping σε design project** (προαιρετικό) - για να εμφανίζονται αυτόματα στη σελίδα design.html

### Προσθήκη Project με Design Mapping

Για να προσθέσετε εικόνες σε ένα design project (π.χ. "Product Design & 3D Printing - NKUA"):

1. **Δημιουργήστε φάκελο** για το project:
   ```
   assets/images/3d-printing/nkua-project/
   ```

2. **Προσθέστε τις εικόνες** στον φάκελο (με format: `timestamp-400w.jpg`, `timestamp-800w.jpg`, `timestamp-1200w.jpg`)

3. **Επεξεργαστείτε το `build-gallery.js`**:
   ```javascript
   const projects = {
       'nkua-project': {
           folder: 'nkua-project',
           enabled: true,
           designProject: 'design.project6'  // Maps to design.project6 in design.html
       },
       // ... other projects
   };
   ```

4. **Εκτελέστε** `npm run build-gallery`

5. **Οι εικόνες θα εμφανίζονται αυτόματα** στο design project!

### Προσθήκη Νέου Project (χωρίς design mapping)

Για projects που εμφανίζονται μόνο στη σελίδα 3d-printing.html:

1. Δημιουργήστε φάκελο: `assets/images/3d-printing/νέος-φάκελος/`
2. Προσθέστε εικόνες
3. Επεξεργαστείτε `build-gallery.js`:
   ```javascript
   'νέος-φάκελος': {
       folder: 'νέος-φάκελος',
       enabled: true,
       designProject: null  // No design mapping
   }
   ```
4. Εκτελέστε `npm run build-gallery`

## Troubleshooting

**Πρόβλημα:** Οι εικόνες δεν εμφανίζονται
- Ελέγξτε ότι έχετε εκτελέσει `npm run build-gallery`
- Ελέγξτε ότι όλες οι εικόνες έχουν και τις 3 εκδόσεις (400w, 800w, 1200w)
- Ελέγξτε το browser console για errors

**Πρόβλημα:** Το script δεν βρίσκει εικόνες
- Ελέγξτε ότι οι εικόνες έχουν το σωστό format: `{timestamp}-{size}w.jpg`
- Ελέγξτε ότι ο φάκελος είναι ενεργοποιημένος στο `build-gallery.js`
