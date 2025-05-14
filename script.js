// Function to play click sound
function playClickSound() {
  const sound = document.getElementById('clickSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.error('Error playing click sound:', error);
    });
  }
}

// Initialize skeleton loading
function initializeSkeletonLoading() {
  const skeleton = document.querySelector('.skeleton');
  if (skeleton) {
    skeleton.style.display = 'block';
    setTimeout(() => {
      skeleton.style.display = 'none';
    }, 2000); // Show skeleton for 2 seconds
  }
}

// Add click effects to all interactive elements
document.querySelectorAll('button, a, .clickable, .card, .bottom-nav img, .rent-now, .coins button, .dark-toggle, .switch, .slider').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const ripple = document.createElement('span');
    ripple.style.left = e.clientX - e.target.getBoundingClientRect().left + 'px';
    ripple.style.top = e.clientY - e.target.getBoundingClientRect().top + 'px';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
    
    // Prevent default action for links if needed
    if (el.tagName === 'A') {
      e.preventDefault();
    }
    
    playClickSound();
    
    // Visual effects
    el.classList.add('click-animate');
    setTimeout(() => el.classList.remove('click-animate'), 200);
    
    // Add specific effects for certain elements
    if (el.classList.contains('card') || el.classList.contains('bottom-nav')) {
      el.classList.add('pop-effect');
      setTimeout(() => el.classList.remove('pop-effect'), 300);
      
      // Trigger shine effect
      const shine = document.createElement('div');
      shine.classList.add('shine-overlay');
      el.appendChild(shine);
      setTimeout(() => shine.remove(), 500);
    }
  });
});



// Add click handler for dark mode toggle specifically
document.getElementById('darkModeToggle').addEventListener('change', (e) => {
  playClickSound();
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Dark Mode Toggle
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  // Save preference to localStorage (optional)
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Set default mode
window.addEventListener('load', () => {
  document.body.classList.add('light-mode');
});

// Set initial mode (optional)
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  element.classList.remove('shine');
  void element.offsetWidth;
  element.classList.add('shine');
}

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(err => {
    console.error('Error playing the click sound:', err);
  });
}

// Banner rotation
const bannerWrapper = document.querySelector(".banner-wrapper");
const banners = document.querySelectorAll(".banner-slide");
const totalBanners = banners.length;
let currentBanner = 0;

const backgrounds = [
  "banner-bg1.jpg",
  "banner-bg2.jpg",
  "banner-bg3.jpg",
  "banner-bg4.jpg"
];

// Banner rotation interval
setInterval(() => {
  currentBanner = (currentBanner + 1) % totalBanners;
  bannerWrapper.style.transform = `translateX(-${currentBanner * 100}%)`;
  document.body.style.backgroundImage = `url(${backgrounds[currentBanner]})`;
}, 4000);

// Add click effects to all clickable elements
document.querySelectorAll('.clickable, button, a, img').forEach(el => {
  el.addEventListener('click', () => {
    playClickSound();
    el.classList.add('click-animate');
    setTimeout(() => el.classList.remove('click-animate'), 200);
  });
});

// ...existing code...
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    // Save preference to localStorage (optional)
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Set initial mode (optional)
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');

    toggle.checked = true;
}
// ...existing code...
<script>
// Add this to your existing scripts
document.querySelectorAll('.card').forEach(card => {
    const quickView = document.createElement('div');
    quickView.className = 'quick-view';
    quickView.textContent = 'Quick View';
    card.appendChild(quickView);
    
    quickView.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = document.getElementById('quickViewModal');
        const img = card.querySelector('img').src;
        const title = card.querySelector('p strong').textContent;
        const price = card.querySelector('.price').textContent;
        const specs = card.querySelector('.specs').innerHTML;
        
        document.getElementById('modalImage').src = img;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalPrice').textContent = price;
        document.getElementById('modalSpecs').innerHTML = specs;
        
        modal.style.display = 'block';
    });
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('quickViewModal').style.display = 'none';
});
</script>

<script>
// Check for dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.style.background = 'linear-gradient(135deg, #1a1a1a, #2d3436)';
    document.querySelectorAll('.card').forEach(card => {
        card.style.background = '#2d3436';
        card.style.color = '#fff';
    });
}
</script>

<audio id="clickSound" src="mouse-click.mp3" preload="auto"></audio>
<script>
const clickSound = document.getElementById('clickSound');
document.querySelectorAll('.btn, .back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(err => console.error('Error playing sound:', err));
        }
    });
});
</script>

// Support button click handler
document.getElementById('supportLogo').addEventListener('click', () => {
  // Play click sound
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.error('Error playing sound:', err));
  }
  
  // Open chat in new window
  const chatWindow = window.open('chat.html', 'PackarooSupport', 
      'width=400,height=600,resizable=yes,scrollbars=yes,status=yes');
});

// Support button click handler
document.getElementById('supportLogo').addEventListener('click', () => {
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(err => console.error('Error playing sound:', err));
  }
  
  // Open chat in new window
  window.open('chat.html', 'PackarooSupport', 
      'width=400,height=600,resizable=yes,scrollbars=yes,status=yes');
});

<script>
    const swiper = new Swiper(".mySwiper", {
        effect: "fade",
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        }
    });
</script>

// Banner Slider
const swiper = new Swiper(".mySwiper", {
  effect: "fade",
  loop: true,
  autoplay: {
      delay: 3000,      // Single click effect handler
      function addClickEffects(elements) {
          elements.forEach(el => {
              el.addEventListener('click', (e) => {
                  playClickSound();
                  addRippleEffect(e, el);
                  addVisualEffects(el);
              });
          });
      }
      
      // Initialize click effects
      addClickEffects(document.querySelectorAll('.clickable, button, a, img'));
      disableOnInteraction: false,
  },
  fadeEffect: {  <script>
  // Support button click handler
  document.getElementById('.support-float  const swiper = new Swiper(".mySwiper", {
      effect: "fade",
      loop: true,
      autoplay: {
          delay: 3000,
          disableOnInteraction: false,
      },
      fadeEffect: {
          crossFade: true
      },
      pagination: {
          el: ".swiper-pagination",
          clickable: true
      },
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      }
  });').addEventListener('click', () => {
      // Play click sound
      const clickSound = document.getElementById('clickSound');      // Single support button click handler
      document.querySelector('.support-float').addEventListener('click', () => {
          playClickSound();
          window.open('chat.html', 'PackarooSupport', 
              'width=400,height=600,resizable=yes,scrollbars=yes,status=yes,location=no');
      });
      
      // Single dark mode toggle handler
      const darkModeToggle = document.getElementById('darkModeToggle');
      darkModeToggle.addEventListener('change', () => {
          playClickSound();
          document.body.classList.toggle('dark-mode');
          localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      });
      if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play().catch(err => console.error('Error playing sound:', err));
      }
      
      // Open chat.html in a new window
      const chatWindow = window.open('chat.html', 'PackarooSupport', 
          'width=400,height=600,resizable=yes,scrollbars=yes,status=yes,location=no');
  });
  </script>
      crossFade: true
  },
  pagination: {
      el: ".swiper-pagination",
      clickable: true
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  }
});

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Packaroo</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
</head>
<body>
    <!-- Splash Screen -->
    <div id="splash-screen">
        <img src="Photoroom-20250429_234355.png" alt="Packaroo Logo">
    </div>

    <!-- Search Bar -->
    <div class="search-container">
        <input type="text" placeholder="Search...">
        <button class="clickable"><img src="magnifying-glass.png" alt="Search"></button>
    </div>

    <!-- Header -->
    <header>
        <div class="logo">
            <img src="Photoroom-20250429_234355.png" alt="Packaroo Logo">
        </div>
        <div class="dark-toggle">
            <div class="toggle-icons">
                <img class="moon-icon" src="half-moon.png" alt="Dark Mode">
                <img class="sun-icon" src="sun.png" alt="Light Mode">
            </div>
            <label class="switch">
                <input id="darkModeToggle" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
    </header>

    <!-- Banner Section -->
    <section class="banner-container swiper mySwiper">
        <!-- Banner slides here -->
    </section>

    <!-- Product Grid -->
    <section class="products">
        <h3>Best Deals on Tech & Fashion</h3>
        <div class="product-grid">
            <!-- Product cards here -->
        </div>
    </section>

    <!-- Navigation -->
    <nav>
        <a href="#" class="clickable">drones</a>
        <a href="#" class="clickable">cameras</a>
        <a href="#" class="clickable">accessories</a>
        <a href="#" class="clickable">tools</a>
        <a href="#" class="clickable">clothes</a>
    </nav>

    <!-- Bottom Navigation -->
    <footer class="bottom-nav">
        <!-- Navigation icons here -->
    </footer>

    <!-- Support Button -->
    <div id="supportLogo" class="support-float clickable">
        <img src="a-modern-3d-customer-support-icon-featur__UF6edupQw-AcGctMzo8TA_xQhADY0jSK-YQhJxqbYy1w.png" alt="Support">
    </div>

    <!-- Social Icons -->
    <div class="support-icons">
        <a href="https://wa.me/917004347593" target="_blank" class="support-icon whatsapp-icon">
            <img src="https://img.icons8.com/fluency/48/000000/whatsapp.png" alt="WhatsApp">
        </a>
        <a href="https://www.instagram.com/packa.roo" target="_blank" class="support-icon instagram-icon">
            <img src="https://img.icons8.com/fluency/48/000000/instagram-new.png" alt="Instagram">
        </a>
    </div>

    <!-- Scripts -->
    <audio id="clickSound" src="mouse-click.mp3" preload="auto"></audio>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script src="particles.js"></script>
    <script src="script.js"></script>
</body>
</html>
