// 3D Printing Gallery - Dynamic Project Cards Generation
// Images are loaded dynamically from gallery-images.json
(function() {
    'use strict';

    // Gallery data loaded from JSON
    let galleryData = null;

    /**
     * Load gallery images from JSON file
     * @returns {Promise<Object>} Gallery data object
     */
    async function loadGalleryData() {
        if (galleryData) {
            return galleryData;
        }

        try {
            const response = await fetch('assets/data/gallery-images.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            galleryData = await response.json();
            return galleryData;
        } catch (error) {
            console.error('Error loading gallery data:', error);
            // Fallback to empty data structure
            return {
                galleries: {
                    '3d-printed parts': [],
                    'replica': [],
                    '3d-printing': []
                }
            };
        }
    }

    // Extract year from timestamp (YYYYMMDD format)
    function getYearFromTimestamp(timestamp) {
        return timestamp.substring(0, 4);
    }

    // Generate compact project card with mini-grid preview
    function generateProjectCard(imagesArray, titleKey, descKey, folder = '3d-printed parts', gridLayout = '3x2') {
        // Get translations from the global translations object
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const t = translations[currentLang] || translations.en;
        
        const projectTitle = t[titleKey] || titleKey;
        const projectDescription = t[descKey] || descKey;
        const imageCountText = imagesArray.length === 1 
            ? t["pages.3dPrinting.imageCount.singular"] || 'image'
            : t["pages.3dPrinting.imageCount.plural"] || 'images';
        
        const years = [...new Set(imagesArray.map(img => getYearFromTimestamp(img)))].sort().reverse();
        const yearTags = years.map(year => `<span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">${year}</span>`).join('');
        
        // Parse grid layout (e.g., "3x2" = 3 cols, 2 rows)
        const [cols, rows] = gridLayout.split('x').map(n => parseInt(n));
        const previewCount = cols * (rows || 1);
        
        // Generate mini-grid HTML with preview images (visible)
        let miniGridHTML = '';
        for (let i = 0; i < Math.min(previewCount, imagesArray.length); i++) {
            const imageBase = imagesArray[i];
            const imagePath = `assets/images/3d-printing/${folder}/${imageBase}`;
            const imageAlt = `${projectTitle} - Image ${i + 1}`;
            
            miniGridHTML += `
                <div class="relative overflow-hidden">
                    <img 
                        src="${imagePath}-800w.jpg" 
                        srcset="${imagePath}-400w.jpg 400w,
                                ${imagePath}-800w.jpg 800w,
                                ${imagePath}-1200w.jpg 1200w"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt="${imageAlt}" 
                        class="w-full h-full object-cover lazy-image lightbox-image cursor-pointer hover:opacity-90 transition-opacity"
                        loading="lazy"
                        data-fullsize="${imagePath}-1200w.jpg"
                        onerror="this.style.display='none';"
                    >
                </div>
            `;
        }
        
        // Generate hidden images for lightbox (all remaining images)
        let hiddenImagesHTML = '';
        if (imagesArray.length > previewCount) {
            hiddenImagesHTML = '<div class="hidden">';
            for (let i = previewCount; i < imagesArray.length; i++) {
                const imageBase = imagesArray[i];
                const imagePath = `assets/images/3d-printing/${folder}/${imageBase}`;
                const imageAlt = `${projectTitle} - Image ${i + 1}`;
                
                hiddenImagesHTML += `
                    <img 
                        src="${imagePath}-400w.jpg" 
                        srcset="${imagePath}-400w.jpg 400w,
                                ${imagePath}-800w.jpg 800w,
                                ${imagePath}-1200w.jpg 1200w"
                        alt="${imageAlt}" 
                        class="lightbox-image"
                        loading="lazy"
                        data-fullsize="${imagePath}-1200w.jpg"
                    >
                `;
            }
            hiddenImagesHTML += '</div>';
        }
        
        // Grid classes based on layout
        const gridClasses = rows ? `grid-cols-${cols} grid-rows-${rows}` : `grid-cols-${cols}`;
        
        // Determine the appropriate i18n key for image count
        const imageCountKey = imagesArray.length === 1 
            ? 'pages.3dPrinting.imageCount.singular' 
            : 'pages.3dPrinting.imageCount.plural';
        
        return `
            <div class="bg-card rounded-lg p-6 project-card">
                <div class="aspect-video bg-tertiary rounded mb-4 overflow-hidden relative">
                    <div class="grid ${gridClasses} gap-1 w-full h-full">
                        ${miniGridHTML}
                    </div>
                </div>
                ${hiddenImagesHTML}
                <h3 class="text-xl font-bold mb-2 text-blue-400" data-i18n="${titleKey}">${projectTitle}</h3>
                <p class="text-gray-400 text-sm mb-4">
                    <span data-i18n="${descKey}">${projectDescription}</span> • 
                    ${imagesArray.length} <span data-i18n="${imageCountKey}">${imageCountText}</span>
                </p>
                <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">PLA</span>
                    ${yearTags}
                </div>
            </div>
        `;
    }

    // Populate 3D-Printed Parts Gallery
    async function populatePrintedPartsGallery() {
        const gallery = document.getElementById('3d-printed-parts-gallery');
        if (!gallery) return;

        const data = await loadGalleryData();
        // Support both new projects structure and legacy galleries
        const printedPartsImages = data.projects?.['3d-printed-parts']?.images || 
                                   data.galleries?.['3d-printed parts'] || [];

        if (printedPartsImages.length === 0) {
            gallery.innerHTML = '<p class="text-gray-400 text-center">No images found. Run <code>npm run build-gallery</code> to scan for images.</p>';
            return;
        }

        // Create grid container for project cards
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        
        // Generate project card with 3x2 preview (6 images) but all images in lightbox
        const cardHTML = generateProjectCard(
            printedPartsImages, 
            'pages.3dPrinting.card.printedParts.title',
            'pages.3dPrinting.card.printedParts.description',
            '3d-printed parts',
            '3x2'
        );
        
        gridContainer.innerHTML = cardHTML;
        gallery.innerHTML = '';
        gallery.appendChild(gridContainer);

        // Re-initialize after DOM update - using requestAnimationFrame for proper timing
        requestAnimationFrame(() => {
            // Apply translations IMMEDIATELY to prevent flickering
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations();
            }
            
            // Re-initialize Lucide icons for new cards
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Re-initialize lightbox for new images
            if (typeof window.reinitLightbox === 'function') {
                window.reinitLightbox();
            }
        });
    }

    // Check for 3D Printing Project images (from 3d-printing folder)
    async function populate3DPrintingProjectGallery() {
        const gallery = document.getElementById('3d-printing-project-gallery');
        const placeholder = document.getElementById('3d-printing-placeholder');
        const section = document.getElementById('3d-printing-project-section');
        
        if (!gallery) return;

        const data = await loadGalleryData();
        // Support both new projects structure and legacy galleries
        const printingProjectImages = data.projects?.['3d-printing']?.images || 
                                     data.galleries?.['3d-printing'] || [];
        
        if (printingProjectImages.length > 0) {
            // Hide placeholder if images exist
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Create grid container for project cards
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
            
            // Generate project card with appropriate grid layout
            const cardHTML = generateProjectCard(
                printingProjectImages, 
                '3D Printing Project',
                'Custom 3D printing projects',
                '3d-printing',
                '3x2'
            );
            
            gridContainer.innerHTML = cardHTML;
            gallery.innerHTML = '';
            gallery.appendChild(gridContainer);

            // Re-initialize after DOM update - using requestAnimationFrame for proper timing
            requestAnimationFrame(() => {
                // Re-initialize Lucide icons for new cards
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                // Re-initialize lightbox for new images
                if (typeof window.reinitLightbox === 'function') {
                    window.reinitLightbox();
                }
            });
        } else {
            // Show placeholder if no images exist
            if (placeholder) {
                placeholder.style.display = 'block';
            }
            // Optionally hide the section entirely if you prefer:
            // if (section) section.style.display = 'none';
        }
    }

    // Populate Replica Gallery (bomb thrower replica from online games)
    async function populateReplicaGallery() {
        const gallery = document.getElementById('replica-gallery');
        
        if (!gallery) return;

        const data = await loadGalleryData();
        // Support both new projects structure and legacy galleries
        const replicaImages = data.projects?.['replica']?.images || 
                             data.galleries?.['replica'] || [];

        if (replicaImages.length === 0) {
            return; // Don't show anything if no images
        }

        // Create grid container for project cards
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        
        // Generate project card with 3x1 preview (all 3 images)
        const cardHTML = generateProjectCard(
            replicaImages, 
            'pages.3dPrinting.card.replica.title',
            'pages.3dPrinting.card.replica.description',
            'replica',
            '3x1'
        );
        
        gridContainer.innerHTML = cardHTML;
        gallery.innerHTML = '';
        gallery.appendChild(gridContainer);

        // Re-initialize after DOM update - using requestAnimationFrame for proper timing
        requestAnimationFrame(() => {
            // Apply translations IMMEDIATELY to prevent flickering
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations();
            }
            
            // Re-initialize Lucide icons for new cards
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Re-initialize lightbox for new images
            if (typeof window.reinitLightbox === 'function') {
                window.reinitLightbox();
            }
        });
    }

    // Initialize galleries when DOM is ready
    async function init() {
        const initGalleries = async () => {
            await Promise.all([
                populatePrintedPartsGallery(),
                populate3DPrintingProjectGallery(),
                populateReplicaGallery()
            ]);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGalleries);
        } else {
            initGalleries();
        }
    }

    init();
})();
