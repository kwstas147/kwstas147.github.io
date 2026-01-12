// Design Gallery - Load 3D printing images for design projects
// This script loads images from 3d-printing folder and adds them to design projects
(function() {
    'use strict';

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
            return { projects: {}, galleries: {} };
        }
    }

    /**
     * Generate image gallery HTML for a design project
     * @param {string[]} images - Array of image timestamps
     * @param {string} folder - Folder name where images are stored
     * @returns {string} HTML string
     */
    function generateImageGallery(images, folder) {
        if (!images || images.length === 0) {
            return '';
        }

        let galleryHTML = '<div class="grid grid-cols-2 gap-2 mb-4">';
        
        // Show first 4 images in grid (or all if less than 4)
        const displayCount = Math.min(4, images.length);
        
        for (let i = 0; i < displayCount; i++) {
            const imageBase = images[i];
            const imagePath = `assets/images/3d-printing/${folder}/${imageBase}`;
            
            galleryHTML += `
                <img 
                    src="${imagePath}-400w.jpg" 
                    alt="3D Printed Part - Image ${i + 1}" 
                    class="w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity lightbox-image"
                    loading="lazy"
                    data-fullsize="${imagePath}-1200w.jpg"
                >
            `;
        }
        
        galleryHTML += '</div>';
        
        // Add hidden images for lightbox (remaining images)
        if (images.length > displayCount) {
            galleryHTML += '<div class="hidden">';
            for (let i = displayCount; i < images.length; i++) {
                const imageBase = images[i];
                const imagePath = `assets/images/3d-printing/${folder}/${imageBase}`;
                
                galleryHTML += `
                    <img 
                        src="${imagePath}-400w.jpg" 
                        alt="3D Printed Part - Image ${i + 1}" 
                        class="lightbox-image"
                        loading="lazy"
                        data-fullsize="${imagePath}-1200w.jpg"
                    >
                `;
            }
            galleryHTML += '</div>';
        }
        
        return galleryHTML;
    }

    /**
     * Find design project card by data attribute
     * @param {string} designProjectKey - The design project key (e.g., 'design.project6')
     * @returns {HTMLElement|null} The project card element
     */
    function findDesignProjectCard(designProjectKey) {
        // Try to find by data attribute first
        const cardByData = document.querySelector(`[data-design-project="${designProjectKey}"]`);
        if (cardByData) {
            return cardByData.closest('.project-card') || cardByData;
        }
        
        // Fallback: find by title text matching
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const t = translations[currentLang] || translations.en;
        const projectTitle = t[`${designProjectKey}.title`];
        
        if (projectTitle) {
            const allCards = document.querySelectorAll('.project-card');
            for (const card of allCards) {
                const titleElement = card.querySelector('h3');
                if (titleElement && titleElement.textContent.trim() === projectTitle) {
                    return card;
                }
            }
        }
        
        return null;
    }

    /**
     * Add images to a design project
     * @param {string} designProjectKey - The design project key
     * @param {string[]} images - Array of image timestamps
     * @param {string} folder - Folder name
     */
    function addImagesToDesignProject(designProjectKey, images, folder) {
        const projectCard = findDesignProjectCard(designProjectKey);
        if (!projectCard) {
            console.warn(`Design project card not found for: ${designProjectKey}`);
            return;
        }

        // Find the main image container (aspect-video div)
        const imageContainer = projectCard.querySelector('.aspect-video');
        if (!imageContainer) {
            console.warn(`Image container not found for project: ${designProjectKey}`);
            return;
        }

        // Check if gallery already exists
        let galleryContainer = projectCard.querySelector('.design-project-gallery');
        
        if (!galleryContainer) {
            // Create gallery container after the main image
            galleryContainer = document.createElement('div');
            galleryContainer.className = 'design-project-gallery';
            imageContainer.parentNode.insertBefore(galleryContainer, imageContainer.nextSibling);
        }

        // Generate and insert gallery HTML
        const galleryHTML = generateImageGallery(images, folder);
        if (galleryHTML) {
            galleryContainer.innerHTML = galleryHTML;
        }
    }

    /**
     * Initialize design projects with 3D printing images
     */
    async function initDesignProjects() {
        const data = await loadGalleryData();
        
        if (!data.projects) {
            console.log('No projects data found');
            return;
        }

        // Iterate through all projects
        Object.keys(data.projects).forEach(projectId => {
            const project = data.projects[projectId];
            
            // Check if this project is mapped to a design project
            if (project.designProject && project.images && project.images.length > 0) {
                console.log(`Adding ${project.images.length} images to ${project.designProject}`);
                addImagesToDesignProject(project.designProject, project.images, project.folder);
            }
        });

        // Re-initialize lightbox after adding images
        requestAnimationFrame(() => {
            if (typeof window.reinitLightbox === 'function') {
                window.reinitLightbox();
            }
        });
    }

    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDesignProjects);
        } else {
            initDesignProjects();
        }
    }

    init();
})();
