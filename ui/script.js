// Slideshow functionality
let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(() => showSlides(slideIndex += 1), 3000);
}

// Greeting Text Animation
const greetingTexts = document.querySelectorAll('.greeting-text');
let currentGreeting = 0;

function rotateGreeting() {
    greetingTexts.forEach(text => text.classList.remove('active'));
    currentGreeting = (currentGreeting + 1) % greetingTexts.length;
    greetingTexts[currentGreeting].classList.add('active');
}

setInterval(rotateGreeting, 2000);

// Fade Up Animation on Scroll
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(element => {
    observer.observe(element);
}); 