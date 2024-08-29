import 'animate.css';
document.getElementById('viewProjectsBtn').addEventListener('click', function() {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});
// Get the elements you want to animate
// document.querySelector('.line1').textContent = "Hello,";
document.querySelector('.line2').textContent = "I'm Youssef";

// Function to animate the text
function animateText(element, text) {
    let index = 0;
    const intervalId = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index === text.length) {
            clearInterval(intervalId);   
        }
    }, 100); // Adjust the interval (100ms) for typing speed
}
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const section_1 = document.getElementById("vertical");
const col_left = document.querySelector(".col_left");
const timeln = gsap.timeline({ paused: true });

timeln.fromTo(col_left, {y: 0}, {y: '170vh', duration: 1, ease: 'none'}, 0);

const scroll_1 = ScrollTrigger.create({
    animation: timeln,
    trigger: section_1,
    start: 'top top',
    end: 'bottom center',
    scrub: true
});
// function playAppropriateVideo() {
//     const isMobile = window.matchMedia("(max-width: 768px)").matches; // Adjust the width as needed
//     if (isMobile) {
//       document.getElementById('video-mobile').style.display = 'none';
//     } else {
//       document.getElementById('video-desktop').style.display = 'none';
//     }
//   }
