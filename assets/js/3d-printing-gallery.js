// 3D Printing Gallery - Dynamic Project Cards Generation
(function() {
    'use strict';

    // 3D-Printed Parts images - all unique timestamps (90 images total)
    const printedPartsImages = [
        '20220307-184742', '20220307-184759', '20220307-184829', '20220307-184857', '20220307-184904',
        '20220307-184942', '20220307-185013', '20220307-185106', '20220307-185117', '20220307-185139',
        '20220307-185152', '20220307-185202', '20220307-185336', '20220307-185415', '20220307-185543',
        '20220307-185558', '20220307-185621', '20220307-185700', '20220307-185712', '20220307-185715',
        '20220307-185743', '20220307-185801', '20220307-185810', '20220307-185843', '20220307-185852',
        '20220307-185908', '20220307-185934', '20220307-185939', '20220307-185957', '20220307-190012',
        '20220307-190026', '20220307-190049', '20220307-190057', '20220307-190104', '20220307-190129',
        '20220307-190139', '20220307-190156', '20220307-190202', '20220307-190215', '20220307-190229',
        '20220307-190251', '20220307-190316', '20220307-190415', '20220307-190431', '20220307-190438',
        '20220307-190451', '20220307-190510', '20220307-190649', '20220307-190703', '20220307-190710',
        '20220307-190802', '20220307-190903', '20220307-190908', '20220307-191052', '20220307-191104',
        '20220307-191112', '20220307-191255', '20220307-191342', '20220307-191349', '20220307-191422',
        '20220307-191430', '20220307-191557', '20220307-191619', '20220307-191632', '20220307-192030',
        '20220307-193015', '20220307-193029', '20220307-193109', '20220307-193115', '20220307-193126',
        '20220307-193132', '20220307-193149', '20220307-193156', '20220307-193343', '20220307-193451',
        '20220307-193538', '20220307-193546', '20220307-194216', '20220307-194257', '20220307-194308',
        '20220307-194444', '20220307-194458', '20220307-194508', '20220307-194954', '20220307-195010',
        '20260109-234443', '20260109-234451', '20260109-234517', '20260110-084049', '20260110-084057'
    ];

    // Replica Project images - bomb thrower replica from online games (3 images)
    const replicaImages = [
        '20260110-144135', '20260110-144155', '20260110-144235'
    ];

    // Extract year from timestamp (YYYYMMDD format)
    function getYearFromTimestamp(timestamp) {
        return timestamp.substring(0, 4);
    }

    // Generate project card HTML
    function generateProjectCard(imageBase, folder = '3d-printed parts') {
        const year = getYearFromTimestamp(imageBase);
        const imagePath = `assets/images/3d-printing/${folder}/${imageBase}`;
        const imageAlt = `3D Printed Part - ${imageBase}`;

        return `
            <div class="bg-card rounded-lg p-6 project-card">
                <div class="aspect-video bg-tertiary rounded mb-4 overflow-hidden relative">
                    <img 
                        src="${imagePath}-400w.jpg" 
                        srcset="${imagePath}-400w.jpg 400w,
                                ${imagePath}-800w.jpg 800w,
                                ${imagePath}-1200w.jpg 1200w"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt="${imageAlt}" 
                        class="w-full h-full object-cover lazy-image lightbox-image cursor-pointer hover:opacity-90 transition-opacity"
                        loading="lazy"
                        width="800"
                        height="450"
                        data-fullsize="${imagePath}-1200w.jpg"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >
                    <div class="absolute inset-0 bg-tertiary rounded flex items-center justify-center" style="display: none;">
                        <i data-lucide="image" class="w-12 h-12 text-slate-500"></i>
                    </div>
                </div>
                <h3 class="text-xl font-bold mb-2 text-blue-400" data-i18n="pages.3dPrinting.cardTitle">3D Printed Part</h3>
                <p class="text-gray-400 text-sm mb-4" data-i18n="pages.3dPrinting.cardDescription"></p>
                <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">PLA</span>
                    <span class="px-2 py-1 bg-tertiary text-xs text-gray-300 rounded">${year}</span>
                </div>
            </div>
        `;
    }

    // Populate 3D-Printed Parts Gallery
    function populatePrintedPartsGallery() {
        const gallery = document.getElementById('3d-printed-parts-gallery');
        if (!gallery) return;

        let cardsHTML = '';
        printedPartsImages.forEach(imageBase => {
            cardsHTML += generateProjectCard(imageBase, '3d-printed parts');
        });

        gallery.innerHTML = cardsHTML;

        // Re-initialize Lucide icons for new cards
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);

        // Re-initialize lightbox for new images
        setTimeout(() => {
            if (typeof window.reinitLightbox === 'function') {
                window.reinitLightbox();
            }
        }, 200);
    }

    // Check for 3D Printing Project images (from 3d-printing folder)
    function populate3DPrintingProjectGallery() {
        const gallery = document.getElementById('3d-printing-project-gallery');
        const placeholder = document.getElementById('3d-printing-placeholder');
        const section = document.getElementById('3d-printing-project-section');
        
        if (!gallery) return;

        // For now, show placeholder since folder doesn't exist
        // In the future, this can be populated dynamically if images are added
        // If images exist, you can uncomment and populate this array:
        // const printingProjectImages = ['timestamp1', 'timestamp2', ...];
        const printingProjectImages = [];
        
        if (printingProjectImages.length > 0) {
            // Hide placeholder if images exist
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Generate cards for images
            let cardsHTML = '';
            printingProjectImages.forEach(imageBase => {
                cardsHTML += generateProjectCard(imageBase, '3d-printing');
            });
            
            gallery.innerHTML = cardsHTML;

            // Re-initialize Lucide icons for new cards
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);

            // Re-initialize lightbox for new images
            setTimeout(() => {
                if (typeof window.reinitLightbox === 'function') {
                    window.reinitLightbox();
                }
            }, 200);
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
    function populateReplicaGallery() {
        const gallery = document.getElementById('replica-gallery');
        
        if (!gallery) return;

        // Generate cards for replica images
        let cardsHTML = '';
        replicaImages.forEach(imageBase => {
            cardsHTML += generateProjectCard(imageBase, 'replica');
        });

        gallery.innerHTML = cardsHTML;

        // Re-initialize Lucide icons for new cards
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);

        // Re-initialize lightbox for new images
        setTimeout(() => {
            if (typeof window.reinitLightbox === 'function') {
                window.reinitLightbox();
            }
        }, 200);
    }

    // Initialize galleries when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                populatePrintedPartsGallery();
                populate3DPrintingProjectGallery();
                populateReplicaGallery();
            });
        } else {
            populatePrintedPartsGallery();
            populate3DPrintingProjectGallery();
            populateReplicaGallery();
        }
    }

    init();
})();
