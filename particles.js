// Particle effect
const particles = [];
const canvas = document.createElement('canvas');
canvas.className = 'particle-effect';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle(x, y) {
    return {
        x: x,
        y: y,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: 1
    };
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.opacity -= 0.01;
        
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function addParticle(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    particles.push(createParticle(x, y));
}

document.addEventListener('mousemove', addParticle);
window.addEventListener('resize', resizeCanvas);

// Initialize
resizeCanvas();
setInterval(updateParticles, 16);
// Profile Navigation
document.querySelector('.bottom-nav .icon:last-child').addEventListener('click', () => {
    // Save current page state if needed
    window.location.href = 'profile.html';
});