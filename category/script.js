document.addEventListener('DOMContentLoaded', () => {
    // Show skeleton loading
    const skeletonLoading = document.querySelector('.skeleton-loading');
    skeletonLoading.style.display = 'block';

    // Simulate loading delay
    setTimeout(() => {
        skeletonLoading.style.display = 'none';
    }, 1000);

    // Get modal elements
    const rentModal = document.getElementById('rentModal');
    const thankYouModal = document.getElementById('thankYouModal');
    const closeBtn = rentModal.querySelector('.close-modal');
    const confirmBtn = rentModal.querySelector('.confirm-rental');
    const bookNowBtn = rentModal.querySelector('.book-now');
    const modalContent = rentModal.querySelector('.modal-content');

    // Initialize date inputs with today's date
    const today = new Date().toISOString().split('T')[0];
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');

    if (fromDate) fromDate.min = today;
    if (toDate) toDate.min = today;

    // Handle rent button clicks
    document.querySelectorAll('.rent-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productItem = this.closest('.product-item');
            if (!productItem) return;

            const productName = productItem.querySelector('h3').textContent;
            const productImage = productItem.querySelector('.product-image img').src;
            const productFeature = productItem.querySelector('.product-feature').textContent;
            const productRating = productItem.querySelector('.rating').textContent;

            // Update modal content
            document.getElementById('productName').textContent = productName;
            document.getElementById('productImage').src = productImage;
            document.getElementById('productFeature').textContent = productFeature;
            document.getElementById('productRating').textContent = productRating;

            // Reset form fields
            if (fromDate) fromDate.value = '';
            if (toDate) toDate.value = '';
            document.getElementById('fullName').value = '';
            document.getElementById('phoneNumber').value = '';
            document.getElementById('streetAddress').value = '';
            document.getElementById('city').value = '';
            document.getElementById('state').value = '';
            document.getElementById('zipCode').value = '';
            document.getElementById('country').value = '';
            document.getElementById('deliveryInstructions').value = '';

            // Show modal
            rentModal.style.display = 'block';
            setTimeout(() => {
                rentModal.classList.add('show');
            }, 10);
        });
    });

    // Close modal functionality
    closeBtn.onclick = (e) => {
        e.preventDefault();
        rentModal.classList.remove('show');
        setTimeout(() => {
            rentModal.style.display = 'none';
        }, 300);
    }

    // Close when clicking outside
    window.onclick = (event) => {
        if (event.target === rentModal) {
            rentModal.classList.remove('show');
            setTimeout(() => {
                rentModal.style.display = 'none';
            }, 300);
        }
    };

    // Handle form submission
    confirmBtn.onclick = (e) => {
        e.preventDefault();
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const streetAddress = document.getElementById('streetAddress').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zipCode').value;
        const country = document.getElementById('country').value;

        if (fromDate && toDate && fullName && phoneNumber && streetAddress && city && state && zipCode && country) {
            // Change button color to green
            confirmBtn.classList.add('success');

            // Trigger confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
                disableForReducedMotion: true
            });

            // Show thank you message
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.innerHTML = `
                <h2>Thank You!</h2>
                <p>Your rental request has been received. We'll contact you shortly to confirm your booking.</p>
            `;
            rentModal.querySelector('.modal-content').appendChild(messageContent);

            // Hide after 3 seconds
            setTimeout(() => {
                messageContent.remove();
                // Reset button color
                confirmBtn.classList.remove('success');
                // Close rent modal
                rentModal.classList.remove('show');
                setTimeout(() => {
                    rentModal.style.display = 'none';
                }, 300);
            }, 3000);
        } else {
            alert('Please fill in all required fields');
        }
    };

    // Handle Book Now button click
    bookNowBtn.onclick = (e) => {
        e.preventDefault();
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const location = document.getElementById('location').value;

        if (fromDate && toDate && location) {
            // Show thank you modal
            thankYouModal.style.display = 'block';

            // Hide thank you modal after 3 seconds
            setTimeout(() => {
                thankYouModal.style.display = 'none';
                // Close rent modal
                rentModal.classList.remove('show');
                setTimeout(() => {
                    rentModal.style.display = 'none';
                }, 300);
            }, 3000);
        } else {
            alert('Please fill in all required fields');
        }
    };

    // Add to Wishlist functionality
    document.querySelectorAll('.wishlist-action').forEach(button => {
        button.addEventListener('click', function () {
            const productItem = this.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productImg = productItem.querySelector('.product-image img').src;
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (!wishlist.some(item => item.name === productName)) {
                wishlist.push({ name: productName, img: productImg });
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                alert('Added to wishlist!');
            } else {
                alert('Already in wishlist!');
            }
        });
    });
});
