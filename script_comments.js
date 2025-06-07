document.addEventListener('DOMContentLoaded', () => {
    // --- Member Card Scroll Animation (existing code) ---
    const memberCards = document.querySelectorAll('.member-card');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    memberCards.forEach(card => {
        observer.observe(card);
    });

    // --- Comment Section Form Submission (MODIFIED for Formspree AJAX) ---
    const commentForm = document.getElementById('commentForm');
    const formMessage = document.getElementById('formMessage');

    // IMPORTANT: Get your Formspree URL from the 'action' attribute of your form
    // No need to hardcode it here if you set it in HTML
    // const FORMSPREE_URL = commentForm.action; 

    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default full-page form submission

            formMessage.textContent = 'Enviando tu comentario...';
            formMessage.className = 'form-message'; // Reset classes for new message

            const formData = new FormData(commentForm); // Get form data automatically

            try {
                // Send the form data to Formspree using fetch (AJAX)
                const response = await fetch(commentForm.action, {
                    method: 'POST',
                    body: formData, // FormData object handles content-type for multipart/form-data
                    headers: {
                        'Accept': 'application/json' // Tell Formspree we prefer JSON response
                    }
                });

                if (response.ok) { // Check if the response status is 200-299
                    // Formspree returns a success JSON on success for AJAX submissions
                    // const result = await response.json(); // Usually not needed for simple success

                    formMessage.textContent = '¡Comentario enviado con éxito! Gracias por tu feedback.';
                    formMessage.classList.add('success');
                    commentForm.reset(); // Clear all form fields
                    
                    // You might want to temporarily disable the button to prevent double submissions
                    const submitButton = commentForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        setTimeout(() => {
                            submitButton.disabled = false;
                        }, 5000); // Re-enable after 5 seconds
                    }

                } else {
                    // Handle HTTP errors or Formspree's specific error responses
                    const errorText = await response.text(); // Get raw error response
                    console.error('Formspree submission error:', response.status, errorText);
                    formMessage.textContent = 'Hubo un problema al enviar tu comentario. Intenta de nuevo más tarde.';
                    formMessage.classList.add('error');
                }

            } catch (error) {
                console.error('Network or client-side error:', error);
                formMessage.textContent = 'No se pudo conectar con el servidor. Verifica tu conexión.';
                formMessage.classList.add('error');
            }
        });
    }

    // --- Comments Display Section (NO CHANGES - still no direct public API to load comments from Formspree) ---
    // If you need to display previously submitted comments, Formspree doesn't offer a simple
    // public API for reading them back. You would need a different solution for that,
    // like manually updating the HTML or using a more advanced backend system.
    // The previous 'loadComments' function won't work with Formspree.
});