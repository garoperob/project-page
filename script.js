// Ensure GSAP and ScrollTrigger are loaded before this script runs
document.addEventListener('DOMContentLoaded', (event) => {

    gsap.registerPlugin(ScrollTrigger);

    // Select all elements that have the 'scroll-zoom-section' class
    const zoomSections = document.querySelectorAll('.scroll-zoom-section');

    zoomSections.forEach(section => {
        // Find the background image container within each section
        const imageContainer = section.querySelector('.background-image-container');

        if (imageContainer) { // Check if the container exists
            gsap.to(imageContainer, {
                scale: 1.15, // Zooms in to 115% of its original size
                ease: "none", // Linear scaling
                scrollTrigger: {
                    trigger: section, // The current section is the trigger
                    start: "top bottom", // Animation starts when section's top hits viewport bottom
                    end: "bottom top",   // Animation ends when section's bottom leaves viewport top
                    scrub: true,         // Links animation progress to scroll position
                    // markers: true     // Uncomment for debugging ScrollTrigger markers
                }
            });
        }
    });

});