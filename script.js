document.addEventListener('DOMContentLoaded', () => {
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

    function createSnowflakes(container) {
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.width = Math.random() * 4 + 2 + 'px';
            snowflake.style.height = snowflake.style.width;
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
            snowflake.style.opacity = Math.random() * 0.6 + 0.4;
            container.appendChild(snowflake);
        }
    }

    function createWaterfall(container) {
        for (let i = 0; i < 30; i++) {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.height = Math.random() * 100 + 50 + 'px';
            drop.style.animationDuration = Math.random() * 2 + 1 + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(drop);
        }
    }

    function getRandomAnimation() {
        const animations = ['floating', 'sparkle', 'bounce', 'shake'];
        return animations[Math.floor(Math.random() * animations.length)];
    }

    // Update the suggestion generation code
    const getSuggestionsBtn = document.getElementById('getSuggestionsBtn');
    const magicLoading = document.getElementById('magicLoading');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    if (getSuggestionsBtn) {
        getSuggestionsBtn.addEventListener('click', () => {
            // Show magic loading
            magicLoading.innerHTML = '';
            magicLoading.style.display = 'flex';
            for (let i = 0; i < 5; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'magic-sparkle';
                magicLoading.appendChild(sparkle);
            }
            suggestionsContainer.innerHTML = '';
            getSuggestionsBtn.disabled = true;
            getSuggestionsBtn.innerHTML = '<i class="fas fa-magic"></i> Finding Magic...';

            setTimeout(() => {
                // Hide loading
                magicLoading.style.display = 'none';
                getSuggestionsBtn.disabled = false;
                getSuggestionsBtn.innerHTML = '<i class="fas fa-magic"></i> Get Suggestions';

                // Create containers for effects
                const snowContainer = document.createElement('div');
                snowContainer.className = 'snow-container';
                suggestionsContainer.appendChild(snowContainer);
                createSnowflakes(snowContainer);

                const waterfallContainer = document.createElement('div');
                waterfallContainer.className = 'waterfall-container';
                suggestionsContainer.appendChild(waterfallContainer);
                createWaterfall(waterfallContainer);

                // Show example suggestions with random animations
                const suggestions = [
                    { title: 'Snowy Mountain Escape', desc: 'Experience the magic of snow-capped peaks in Manali.' },
                    { title: 'Waterfall Retreat', desc: 'Relax by the cascading falls in Lonavala.' },
                    { title: 'Desert Adventure', desc: 'Experience the magic of the Thar Desert in Jaisalmer.' }
                ];

                suggestions.forEach((s, index) => {
                    const card = document.createElement('div');
                    card.className = `suggestion-card ${getRandomAnimation()}`;
                    card.innerHTML = `
                        <div class='suggestion-title'>${s.title}</div>
                        <div class='suggestion-desc'>${s.desc}</div>
                    `;
                    card.style.animationDelay = `${index * 0.2}s`;
                    suggestionsContainer.appendChild(card);
                });
            }, 2000);
        });
    }
}); 