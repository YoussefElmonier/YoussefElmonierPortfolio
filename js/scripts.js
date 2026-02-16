document.addEventListener("DOMContentLoaded", function () {
    // Reveal animations
    setTimeout(() => document.getElementById("hello")?.classList.add("show"), 500);
    setTimeout(() => document.getElementById("name")?.classList.add("show"), 1500);
    setTimeout(() => document.getElementById("job")?.classList.add("show"), 2500);

    // Initial check after a short delay to ensure jQuery is loaded for Tilt.js
    setTimeout(() => {
        if (typeof mediaQuery !== 'undefined') {
             handleMediaQueryChange(mediaQuery);
             mediaQuery.addEventListener('change', handleMediaQueryChange);
        }
    }, 100);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent default form submission

        const purposeSelect = document.getElementById('purpose');
        const submitButton = document.getElementById('submitButton');

        // Check if purpose is selected
        if (purposeSelect.value === '') {
            alert('Please select a purpose for your contact.');
        } else {
            // Change button state to "Sent!"
            const stateDefault = submitButton.querySelector('.state--default');
            const stateSent = submitButton.querySelector('.state--sent');

            if (stateDefault && stateSent) {
                stateDefault.style.display = 'none'; // Hide default state
                stateSent.style.display = 'block';   // Show sent state
            }

            // Submit the form after changing the button state
            setTimeout(function () {
                contactForm.submit();
            }, 1000);  // Delay to show the "Sent!" state for 1 second before submitting
        }
    });
}

// Media Query for Tilt.js
const mediaQuery = window.matchMedia('(min-width: 768px)');
function handleMediaQueryChange(e) {
    if (e.matches && typeof $ !== 'undefined' && $.fn.tilt) {
        // Use requestIdleCallback for better performance
        const scheduleWork = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
        
        scheduleWork(() => {
            // Select all elements with class 'animation'
            const projectContainers = document.querySelectorAll('.animation');

            // Initialize Tilt.js on each project container
            projectContainers.forEach(container => {
                if ($(container).length) {
                    $(container).tilt({
                        maxTilt: 5,
                        scale: 1.02,
                        speed: 300,
                        glare: true,
                        maxGlare: .2
                    });
                }
            });
        });
    }
}
