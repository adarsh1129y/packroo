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
        button.addEventListener('click', function(e) {
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
            document.getElementById('location').value = '';

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
        const location = document.getElementById('location').value;

        if (fromDate && toDate && location) {
            // Change button color to green
            confirmBtn.classList.add('success');
            
            // Show thank you modal
            const thankYouModal = document.getElementById('thankYouModal');
            thankYouModal.style.display = 'block';
            
            // Reset animation
            const content = thankYouModal.querySelector('.message-content');
            content.style.animation = 'none';
            void content.offsetWidth;
            content.style.animation = 'messageIn 0.5s ease-out forwards';
            
            // Hide after 3 seconds
            setTimeout(() => {
                thankYouModal.style.display = 'none';
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
});
