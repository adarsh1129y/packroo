// Toggle like button color on click
document.querySelectorAll('.icon i.fa-heart').forEach(heart => {
    heart.addEventListener('click', () => {
        heart.classList.toggle('liked');
        heart.style.color = heart.classList.contains('liked') ? '#ff6b6b' : '#b0b0b0';
    });
});

// Log upload button click (placeholder for actual upload functionality)
document.querySelector('.upload-btn').addEventListener('click', () => {
    console.log('Upload Photo/Video button clicked!');
    // Add actual upload functionality here (e.g., trigger file input)
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const likeSound = document.getElementById('likeSound');
    const coinSound = document.getElementById('coinSound');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close-btn');
    const submitBtn = document.getElementById('submitUpload');
    const previewImage = document.getElementById('previewImage');
    const feed = document.getElementById('feed');
    const totalLikesElement = document.getElementById('totalLikes');
    const totalPostsElement = document.getElementById('totalPosts');
    const totalCoinsElement = document.getElementById('totalCoins');
    const userRankElement = document.getElementById('userRank');

    let totalLikes = 0;
    let totalPosts = document.querySelectorAll('.card').length;
    let totalCoins = 0;
    let userRank = 1;

    // Update initial stats
    updateStats();

    // Function to update stats
    function updateStats() {
        totalLikesElement.textContent = totalLikes;
        totalPostsElement.textContent = totalPosts;
        totalCoinsElement.textContent = totalCoins;
        userRankElement.textContent = `#${userRank}`;
    }

    // Function to animate stat update
    function animateStatUpdate(element) {
        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, 300);
    }

    // Modify the existing like functionality
    function handleLike() {
        totalLikes++;
        updateStats();
        animateStatUpdate(totalLikesElement);
    }

    // Modify the existing coin functionality
    function handleCoin() {
        totalCoins++;
        updateStats();
        animateStatUpdate(totalCoinsElement);
    }

    cards.forEach(card => {
        let lastClick = 0;

        card.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClick;

            if (timeDiff < 300 && timeDiff > 0) {
                const likeIcon = card.querySelector('.fa-heart');
                const likeCount = likeIcon.nextSibling;

                likeSound.currentTime = 0;
                likeSound.play();

                likeIcon.classList.add('liked');
                const currentLikes = parseInt(likeCount.textContent);
                likeCount.textContent = ` ${currentLikes + 1}`;

                handleLike();
            }

            lastClick = currentTime;
        });
    });

    // Coin button functionality
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering card click

            const coinIcon = btn.querySelector('i');
            const coinCount = btn.querySelector('.coin-count');
            const card = btn.closest('.card');

            // Create and add coin animation
            const coinAnimation = document.createElement('div');
            coinAnimation.className = 'coin-animation';
            card.appendChild(coinAnimation);

            // Play coin sound
            coinSound.currentTime = 0;
            coinSound.play();

            // Add spin animation to icon
            coinIcon.classList.add('active');
            setTimeout(() => {
                coinIcon.classList.remove('active');
            }, 500);

            // Update coin count
            const currentCoins = parseInt(coinCount.textContent);
            coinCount.textContent = currentCoins + 1;

            handleCoin();

            // Remove animation element after it's done
            setTimeout(() => {
                coinAnimation.remove();
            }, 500);
        });
    });

    // Upload functionality
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                uploadModal.classList.add('active');
            };
            reader.readAsDataURL(file);
        }
    });

    closeBtn.addEventListener('click', () => {
        uploadModal.classList.remove('active');
        fileInput.value = '';
        previewImage.innerHTML = '';
    });

    submitBtn.addEventListener('click', () => {
        const quote = document.getElementById('uploadQuote').value;
        const location = document.getElementById('uploadLocation').value;
        const imageSrc = previewImage.querySelector('img').src;

        if (quote && location) {
            const newCard = createCard(imageSrc, quote, location);
            feed.insertBefore(newCard, feed.firstChild);

            // Reset form
            document.getElementById('uploadQuote').value = '';
            document.getElementById('uploadLocation').value = '';
            uploadModal.classList.remove('active');
            fileInput.value = '';
            previewImage.innerHTML = '';
        }
    });

    function createCard(imageSrc, quote, location) {
        totalPosts++;
        updateStats();
        animateStatUpdate(totalPostsElement);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${imageSrc}" alt="${location}">
            <div class="card-content">
                <p class="quote">${quote}</p>
                <p class="location">${location}</p>
                <p class="date-time">${new Date().toLocaleString()}</p>
                <div class="interactions">
                    <span class="icon"><i class="fas fa-heart"></i> 0</span>
                    <span class="icon"><i class="fas fa-comment"></i> 0</span>
                    <span class="icon coin-btn"><i class="fas fa-coins"></i> <span class="coin-count">0</span></span>
                    <span class="icon"><i class="fas fa-share"></i></span>
                </div>
            </div>
        `;

        addCardEventListeners(card);
        return card;
    }

    function addCardEventListeners(card) {
        let lastClick = 0;

        card.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClick;

            if (timeDiff < 300 && timeDiff > 0) {
                const likeIcon = card.querySelector('.fa-heart');
                const likeCount = likeIcon.nextSibling;

                likeSound.currentTime = 0;
                likeSound.play();

                likeIcon.classList.add('liked');
                const currentLikes = parseInt(likeCount.textContent);
                likeCount.textContent = ` ${currentLikes + 1}`;

                handleLike();
            }

            lastClick = currentTime;
        });

        // Add coin button functionality
        const coinBtn = card.querySelector('.coin-btn');
        coinBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const coinIcon = coinBtn.querySelector('i');
            const coinCount = coinBtn.querySelector('.coin-count');

            const coinAnimation = document.createElement('div');
            coinAnimation.className = 'coin-animation';
            card.appendChild(coinAnimation);

            coinSound.currentTime = 0;
            coinSound.play();

            coinIcon.classList.add('active');
            setTimeout(() => {
                coinIcon.classList.remove('active');
            }, 500);

            const currentCoins = parseInt(coinCount.textContent);
            coinCount.textContent = currentCoins + 1;

            handleCoin();

            setTimeout(() => {
                coinAnimation.remove();
            }, 500);
        });
    }
});