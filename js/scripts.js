document.addEventListener("DOMContentLoaded", function () {
    // Reveal animations
    setTimeout(() => document.getElementById("hello")?.classList.add("show"), 500);
    setTimeout(() => document.getElementById("name")?.classList.add("show"), 1500);
    setTimeout(() => document.getElementById("job")?.classList.add("show"), 2500);

    // Robust initial check for Tilt.js
    let attempts = 0;
    const initTiltInterval = setInterval(() => {
        attempts++;
        if (typeof $ !== 'undefined' && $.fn.tilt) {
            initAllTilts();
            clearInterval(initTiltInterval);
        }
        if (attempts > 100) clearInterval(initTiltInterval); // Stop after 10 seconds
    }, 100);
});

function initAllTilts() {
    if (typeof $ === 'undefined' || !$.fn.tilt) {
        console.warn('Tilt.js or jQuery not found. 3D effects disabled.');
        return;
    }

    const tiltOptions = {
        maxTilt: 15,
        scale: 1.05,
        speed: 800,
        glare: true,
        maxGlare: 0.4,
        perspective: 1000,
        easing: "cubic-bezier(.03,.98,.52,.99)"
    };

    const targetSelectors = '.Proj-container, .cardSkill, .certificate-item, .grid-item, .animation';

    // Direct initialization
    $(targetSelectors).tilt(tiltOptions);

    // Secondary check on hover in case of late reveals
    $(document).on('mouseenter', targetSelectors, function () {
        if (!$(this).data('tilt-initialized')) {
            $(this).tilt(tiltOptions);
            $(this).data('tilt-initialized', true);
        }
    });

    console.log('3D Tilt Effects (Tilt.js) Successfully Initialized');
}

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

