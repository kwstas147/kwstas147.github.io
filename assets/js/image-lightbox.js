/**
 * Image Lightbox with Navigation
 * Reusable module for image galleries with zoom and navigation functionality
 */

(function() {
    'use strict';

    // Global state
    let currentImageIndex = 0;
    let imageGallery = [];
    let currentZoom = 1;
    const minZoom = 0.5;
    const maxZoom = 5;
    const zoomStep = 0.25;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startMouseX = 0;
    let startMouseY = 0;

    // DOM elements (will be initialized)
    let lightbox, lightboxImage, lightboxClose, zoomInBtn, zoomOutBtn, zoomResetBtn, zoomLevel;
    let navPrevBtn, navNextBtn;

    /**
     * Collect all lightbox images from the page
     */
    function collectImages() {
        const images = document.querySelectorAll('.lightbox-image');
        imageGallery = Array.from(images).map(img => ({
            element: img,
            src: img.getAttribute('data-fullsize') || 
                 (img.srcset ? img.srcset.split(', ').pop().split(' ')[0] : null) || 
                 img.src,
            alt: img.alt || ''
        }));
        return imageGallery;
    }

    /**
     * Get full-size image source from an image element
     */
    function getFullSizeSrc(img) {
        return img.getAttribute('data-fullsize') || 
               (img.srcset ? img.srcset.split(', ').pop().split(' ')[0] : null) || 
               img.src;
    }

    /**
     * Update zoom display and transform
     */
    function updateTransform() {
        if (lightboxImage) {
            lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
        }
    }

    function updateZoom() {
        updateTransform();
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
        }
        if (lightboxImage) {
            lightboxImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    }

    /**
     * Reset zoom and position
     */
    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateZoom();
    }

    /**
     * Update navigation arrows visibility
     */
    function updateNavigationArrows() {
        if (!navPrevBtn || !navNextBtn) return;
        
        const hasMultipleImages = imageGallery.length > 1;
        
        if (hasMultipleImages) {
            navPrevBtn.style.display = 'flex';
            navNextBtn.style.display = 'flex';
            // Enable/disable based on position (for loop navigation, always enabled)
            navPrevBtn.disabled = false;
            navNextBtn.disabled = false;
        } else {
            navPrevBtn.style.display = 'none';
            navNextBtn.style.display = 'none';
        }
    }

    /**
     * Open lightbox with specific image index
     */
    function openLightbox(index) {
        if (!lightbox || !lightboxImage || index < 0 || index >= imageGallery.length) return;
        
        currentImageIndex = index;
        const imageData = imageGallery[index];
        
        // Reset zoom when changing images
        resetZoom();
        
        // Load new image
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation arrows
        updateNavigationArrows();
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
    }

    /**
     * Navigate to next image
     */
    function navigateNext() {
        if (imageGallery.length <= 1) return;
        
        currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
        openLightbox(currentImageIndex);
    }

    /**
     * Navigate to previous image
     */
    function navigatePrev() {
        if (imageGallery.length <= 1) return;
        
        currentImageIndex = (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
        openLightbox(currentImageIndex);
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                navigatePrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateNext();
                break;
        }
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        // Get DOM elements
        lightbox = document.getElementById('imageLightbox');
        lightboxImage = document.getElementById('lightboxImage');
        lightboxClose = document.getElementById('lightboxClose');
        zoomInBtn = document.getElementById('zoomIn');
        zoomOutBtn = document.getElementById('zoomOut');
        zoomResetBtn = document.getElementById('zoomReset');
        zoomLevel = document.getElementById('zoomLevel');
        navPrevBtn = document.getElementById('lightboxNavPrev');
        navNextBtn = document.getElementById('lightboxNavNext');

        if (!lightbox || !lightboxImage) {
            console.warn('Lightbox elements not found');
            return;
        }

        // Collect images
        collectImages();

        // Attach click handlers to all lightbox images
        const lightboxImages = document.querySelectorAll('.lightbox-image');
        lightboxImages.forEach((img, index) => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                // Find the index in the gallery
                const galleryIndex = imageGallery.findIndex(item => item.element === img);
                if (galleryIndex !== -1) {
                    openLightbox(galleryIndex);
                } else {
                    // Fallback: use clicked index
                    openLightbox(index);
                }
            });
        });

        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on background click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Navigation arrows
        if (navPrevBtn) {
            navPrevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigatePrev();
            });
        }

        if (navNextBtn) {
            navNextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateNext();
            });
        }

        // Zoom controls
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentZoom < maxZoom) {
                    currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
                    updateZoom();
                }
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentZoom > minZoom) {
                    currentZoom = Math.max(currentZoom - zoomStep, minZoom);
                    updateZoom();
                }
            });
        }

        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                resetZoom();
            });
        }

        // Mouse wheel zoom
        if (lightboxImage) {
            lightboxImage.addEventListener('wheel', function(e) {
                if (!lightbox.classList.contains('active')) return;
                e.preventDefault();
                e.stopPropagation();
                
                const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
                
                if (newZoom !== currentZoom) {
                    currentZoom = newZoom;
                    updateZoom();
                }
            }, { passive: false });

            // Touch pinch zoom (mobile)
            let initialDistance = 0;
            let initialZoom = 1;
            
            lightboxImage.addEventListener('touchstart', function(e) {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    initialDistance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    initialZoom = currentZoom;
                }
            });
            
            lightboxImage.addEventListener('touchmove', function(e) {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const currentDistance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const zoomFactor = currentDistance / initialDistance;
                    currentZoom = Math.max(minZoom, Math.min(maxZoom, initialZoom * zoomFactor));
                    updateZoom();
                }
            });

            // Drag/pan when zoomed
            lightboxImage.addEventListener('mousedown', function(e) {
                if (currentZoom > 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    isDragging = true;
                    startMouseX = e.clientX - translateX;
                    startMouseY = e.clientY - translateY;
                    lightboxImage.classList.add('dragging');
                    lightboxImage.style.cursor = 'grabbing';
                }
            });
        }

        // Global mouse move/up for dragging
        document.addEventListener('mousemove', function(e) {
            if (!isDragging || currentZoom <= 1) return;
            e.preventDefault();
            translateX = e.clientX - startMouseX;
            translateY = e.clientY - startMouseY;
            updateTransform();
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                if (lightboxImage) {
                    lightboxImage.classList.remove('dragging');
                    lightboxImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
                }
            }
        });

        // Update navigation arrows on init
        updateNavigationArrows();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }

    // Re-initialize if new images are added dynamically
    window.reinitLightbox = function() {
        collectImages();
        updateNavigationArrows();
    };

})();
