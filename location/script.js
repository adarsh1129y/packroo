// Add this at the beginning of the file
const texts = ['Travel Easy', 'Packaro'];
let currentTextIndex = 0;
let isDeleting = false;
let currentText = '';
let typingSpeed = 100;
let deletingSpeed = 50;
let pauseTime = 4000; // 4 seconds pause

// Store original prices
let originalPrices = {};

function typeText() {
    const typingElement = document.querySelector('.typing-text');
    const currentFullText = texts[currentTextIndex];

    if (isDeleting) {
        // Deleting text
        currentText = currentFullText.substring(0, currentText.length - 1);
        typingElement.classList.add('deleting');
        typingElement.classList.remove('typing');
    } else {
        // Typing text
        currentText = currentFullText.substring(0, currentText.length + 1);
        typingElement.classList.add('typing');
        typingElement.classList.remove('deleting');
    }

    typingElement.textContent = currentText;

    // Adjust speed based on whether we're typing or deleting
    let speed = isDeleting ? deletingSpeed : typingSpeed;

    // If we've finished typing the current text
    if (!isDeleting && currentText === currentFullText) {
        // Pause before starting to delete
        speed = pauseTime;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        // Move to next text
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        speed = 500; // Pause before starting to type next text
    }

    setTimeout(typeText, speed);
}

// Add loading animation
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Enhanced showServices function with animations
function showServices() {
    const serviceSelect = document.getElementById('serviceSelect').value;
    const sections = ['hotels', 'tentSpots', 'restaurants', 'bikeRentals', 'cabServices'];

    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element.classList.contains('hidden')) {
            element.style.display = 'none';
        } else {
            element.classList.add('hidden');
            element.style.display = 'none';
        }
    });

    if (serviceSelect) {
        const selectedSection = document.getElementById(serviceSelect);
        selectedSection.style.display = 'grid';
        // Trigger reflow
        selectedSection.offsetHeight;
        selectedSection.classList.remove('hidden');
        selectedSection.classList.add('fade-in');
    }
}

// Enhanced updateAreaOptions function
function updateAreaOptions() {
    const state = document.getElementById('stateSelect').value;
    const areaSelect = document.getElementById('areaSelect');

    // Add loading animation
    showLoading(areaSelect);

    setTimeout(() => {
        areaSelect.innerHTML = '<option value="">Select Area</option>';

        const areas = {
            Rajasthan: ['Jaipur', 'Udaipur', 'Jaisalmer'],
            Kerala: ['Kochi', 'Munnar', 'Alleppey'],
            Maharashtra: ['Mumbai', 'Pune', 'Lonavala']
        };

        if (state && areas[state]) {
            areas[state].forEach(area => {
                const option = document.createElement('option');
                option.value = area;
                option.textContent = area;
                areaSelect.appendChild(option);
            });
        }

        hideLoading(areaSelect);
    }, 300); // Simulate loading delay
}

// Function to update prices with discount
function updatePricesWithDiscount(applyDiscount = false) {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        const priceElement = item.querySelector('p:nth-child(3)');
        if (!priceElement) return;

        const priceText = priceElement.textContent;
        const priceMatch = priceText.match(/₹(\d+)/);
        if (!priceMatch) return;

        const serviceId = item.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');

        if (!originalPrices[serviceId]) {
            originalPrices[serviceId] = parseInt(priceMatch[1]);
        }

        const originalPrice = originalPrices[serviceId];
        const discountedPrice = applyDiscount ? Math.floor(originalPrice * 0.9) : originalPrice;

        priceElement.innerHTML = `<i class="fas fa-rupee-sign"></i> Price: ₹${discountedPrice}${applyDiscount ? ' <span class="discount-badge">-10%</span>' : ''}`;
    });
}

// Function to trigger confetti animation
function triggerConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Confetti from left
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });

        // Confetti from right
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Enhanced applyDiscount function
function applyDiscount() {
    const promoCode = document.getElementById('promoCode');
    const button = document.querySelector('.promo-button');

    if (promoCode.value === 'ADARSH10') {
        button.innerHTML = '<i class="fas fa-check"></i> Discount Applied!';
        button.style.backgroundColor = '#27ae60';
        showNotification('10% discount applied successfully!', 'success');
        updatePricesWithDiscount(true);
        triggerConfetti(); // Trigger confetti animation
    } else {
        button.innerHTML = '<i class="fas fa-times"></i> Invalid Code';
        button.style.backgroundColor = '#e74c3c';
        showNotification('Invalid promo code. Please try again.', 'error');
        updatePricesWithDiscount(false);

        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Apply Discount';
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Enhanced rateService function
function rateService(event, serviceId) {
    const stars = event.currentTarget.querySelectorAll('span');
    const ratingDisplay = document.getElementById(`${serviceId}-rating`);
    const clickedStarIndex = Array.from(stars).indexOf(event.target);

    if (clickedStarIndex === -1) return;

    // Add animation to stars
    stars.forEach((star, index) => {
        if (index <= clickedStarIndex) {
            star.classList.add('selected');
            star.style.transform = 'scale(1.2)';
            setTimeout(() => {
                star.style.transform = 'scale(1)';
            }, 200);
        } else {
            star.classList.remove('selected');
        }
    });

    const rating = clickedStarIndex + 1;
    ratingDisplay.textContent = `${rating} star${rating > 1 ? 's' : ''}`;

    // Show rating notification
    showNotification(`Thank you for rating with ${rating} stars!`, 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    typeText();

    // Initialize original prices
    updatePricesWithDiscount(false);

    // Add smooth transitions to all service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.classList.add('slide-up');
    });
});