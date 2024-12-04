// Smooth Scrolling Script
document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section from data-target attribute
            const targetSelector = link.getAttribute('data-target');
            const targetSection = document.querySelector(targetSelector);
            
            if (targetSection) {
                // Smooth scroll to the section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Optional: Smooth scroll for sidebar social links that point to sections
    const sidebarLinks = document.querySelectorAll('.icon-container a[data-target]');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSelector = link.getAttribute('data-target');
            const targetSection = document.querySelector(targetSelector);
            
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
