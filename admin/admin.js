// Initialize Charts
document.addEventListener('DOMContentLoaded', function () {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [150000, 180000, 220000, 250000, 280000, 300000],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Drones', 'Cameras', 'Camping', 'Accessories'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    '#1976d2',
                    '#2e7d32',
                    '#f57c00',
                    '#c2185b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});

// Button Functionality
document.addEventListener('DOMContentLoaded', function () {
    // View All Button
    const viewAllButton = document.querySelector('.view-all');
    if (viewAllButton) {
        viewAllButton.addEventListener('click', function () {
            // Here you would typically load all bookings
            console.log('Loading all bookings...');
            // For demo, we'll just show an alert
            alert('Loading all bookings...');
        });
    }

    // Form Buttons
    const productForm = document.getElementById('productForm');
    if (productForm) {
        const submitButton = productForm.querySelector('button[type="submit"]');
        const resetButton = productForm.querySelector('button[type="reset"]');

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Validate form
            const title = document.getElementById('productTitle').value;
            const category = document.getElementById('productCategory').value;
            const price = document.getElementById('productPrice').value;
            const availability = document.getElementById('productAvailability').value;
            const description = document.getElementById('productDescription').value;

            if (!title || !category || !price || !availability || !description) {
                alert('Please fill in all required fields');
                return;
            }

            // Here you would typically send the data to your backend
            console.log('Adding new product:', {
                title,
                category,
                price,
                availability,
                description
            });

            // Show success message
            alert('Product added successfully!');
            productForm.reset();
        });

        resetButton.addEventListener('click', function () {
            if (confirm('Are you sure you want to reset the form?')) {
                productForm.reset();
            }
        });
    }

    // Customer Support Chat Functionality
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-message');
    const chatMessages = document.querySelector('.chat-messages');
    const conversationItems = document.querySelectorAll('.conversation-item');
    const statusFilter = document.getElementById('statusFilter');
    const conversationSearch = document.getElementById('conversationSearch');

    // Send Message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageHTML = `
                <div class="message admin-message">
                    <div class="message-content">
                        <p>${message}</p>
                        <span class="message-time">${time}</span>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            messageInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Update last message in conversation list
            const activeConversation = document.querySelector('.conversation-item.active');
            if (activeConversation) {
                const lastMessage = activeConversation.querySelector('.last-message');
                lastMessage.textContent = message;
            }
        }
    }

    // Event Listeners for Message Sending
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    if (messageInput) {
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Conversation Selection
    conversationItems.forEach(item => {
        item.addEventListener('click', function () {
            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Update chat header with selected user info
            const userName = this.querySelector('h4').textContent;
            const userImg = this.querySelector('img').src;
            document.querySelector('.chat-user-info h4').textContent = userName;
            document.querySelector('.chat-user-info img').src = userImg;

            // Clear chat messages (in a real app, you would load the conversation history)
            chatMessages.innerHTML = '';
        });
    });

    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            const status = this.value;
            conversationItems.forEach(item => {
                const itemStatus = item.querySelector('.status-badge').classList.contains('active') ? 'active' : 'resolved';
                item.style.display = status === 'all' || status === itemStatus ? 'block' : 'none';
            });
        });
    }

    // Conversation Search
    if (conversationSearch) {
        conversationSearch.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            conversationItems.forEach(item => {
                const userName = item.querySelector('h4').textContent.toLowerCase();
                const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
                const isVisible = userName.includes(searchTerm) || lastMessage.includes(searchTerm);
                item.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // Mark as Resolved
    const resolveButton = document.querySelector('.chat-actions .btn-icon[title="Mark as resolved"]');
    if (resolveButton) {
        resolveButton.addEventListener('click', function () {
            const activeConversation = document.querySelector('.conversation-item.active');
            if (activeConversation) {
                const statusBadge = activeConversation.querySelector('.status-badge');
                statusBadge.classList.remove('active');
                statusBadge.classList.add('resolved');
                statusBadge.textContent = 'Resolved';
                alert('Conversation marked as resolved');
            }
        });
    }

    // Transfer Conversation
    const transferButton = document.querySelector('.chat-actions .btn-icon[title="Transfer conversation"]');
    if (transferButton) {
        transferButton.addEventListener('click', function () {
            const departments = ['Sales', 'Technical Support', 'Billing', 'General Support'];
            const department = prompt('Select department to transfer to:\n' + departments.join('\n'));
            if (department && departments.includes(department)) {
                alert(`Conversation transferred to ${department}`);
            }
        });
    }

    // File Attachment
    const attachButton = document.querySelector('.input-actions .btn-icon[title="Attach file"]');
    if (attachButton) {
        attachButton.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,.pdf,.doc,.docx';
            input.click();

            input.addEventListener('change', function () {
                if (this.files.length > 0) {
                    // Here you would typically upload the file to your server
                    console.log('File selected:', this.files[0].name);

                    // Show file name in chat
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const messageHTML = `
                        <div class="message admin-message">
                            <div class="message-content">
                                <p><i class="fas fa-paperclip"></i> ${this.files[0].name}</p>
                                <span class="message-time">${time}</span>
                            </div>
                        </div>
                    `;
                    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            });
        });
    }

    // Quick Responses
    const quickResponseButton = document.querySelector('.input-actions .btn-icon[title="Add quick response"]');
    if (quickResponseButton) {
        quickResponseButton.addEventListener('click', function () {
            const quickResponses = [
                "Thank you for contacting us!",
                "I'll help you with that right away.",
                "Is there anything else you need assistance with?",
                "Your request has been noted.",
                "I'll transfer you to the appropriate department."
            ];

            const quickResponseMenu = document.createElement('div');
            quickResponseMenu.className = 'quick-response-menu';
            quickResponses.forEach(response => {
                const button = document.createElement('button');
                button.textContent = response;
                button.addEventListener('click', () => {
                    messageInput.value = response;
                    quickResponseMenu.remove();
                });
                quickResponseMenu.appendChild(button);
            });

            document.querySelector('.chat-input').appendChild(quickResponseMenu);
        });
    }

    // Responsive Design
    function handleResponsiveChat() {
        const supportContainer = document.querySelector('.support-container');
        if (window.innerWidth <= 768) {
            const backButton = document.createElement('button');
            backButton.className = 'btn-icon back-to-conversations';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
            backButton.style.display = 'none';

            document.querySelector('.chat-header').prepend(backButton);

            backButton.addEventListener('click', function () {
                supportContainer.classList.add('show-conversations');
                this.style.display = 'none';
            });

            conversationItems.forEach(item => {
                item.addEventListener('click', function () {
                    supportContainer.classList.remove('show-conversations');
                    backButton.style.display = 'block';
                });
            });
        }
    }

    window.addEventListener('resize', handleResponsiveChat);
    handleResponsiveChat();
});

// Image Upload Handling
const imageUpload = document.querySelector('.image-upload');
if (imageUpload) {
    const fileInput = imageUpload.querySelector('input[type="file"]');
    const placeholder = imageUpload.querySelector('.upload-placeholder');

    // Drag and drop functionality
    imageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUpload.classList.add('dragover');
    });

    imageUpload.addEventListener('dragleave', () => {
        imageUpload.classList.remove('dragover');
    });

    imageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUpload.classList.remove('dragover');

        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            // Here you would typically upload the files to your server
            console.log('Files to upload:', files);

            // Show preview
            placeholder.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>${files.length} file(s) selected</p>
            `;
        }
    }
}

// Sidebar Navigation
const navLinks = document.querySelectorAll('.sidebar-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.parentElement.classList.remove('active'));

        // Add active class to clicked link
        this.parentElement.classList.add('active');

        // Here you would typically load the corresponding content
        const section = this.getAttribute('href').substring(1);
        console.log('Loading section:', section);
    });
});

// Notifications
const notificationBell = document.querySelector('.notifications');
if (notificationBell) {
    notificationBell.addEventListener('click', function () {
        // Here you would typically show a notifications dropdown
        console.log('Show notifications');
    });
}

// Profile Menu
const profileMenu = document.querySelector('.profile-menu');
if (profileMenu) {
    profileMenu.addEventListener('click', function () {
        // Here you would typically show a profile dropdown
        console.log('Show profile menu');
    });
}

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        // Here you would typically filter content based on search term
        console.log('Searching for:', searchTerm);
    });
}

// Responsive Sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// Add event listener for window resize
window.addEventListener('resize', toggleSidebar);

// Initialize tooltips
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', function () {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.textContent = tooltipText;
        document.body.appendChild(tooltipEl);

        const rect = this.getBoundingClientRect();
        tooltipEl.style.top = rect.bottom + 5 + 'px';
        tooltipEl.style.left = rect.left + (rect.width - tooltipEl.offsetWidth) / 2 + 'px';
    });

    tooltip.addEventListener('mouseleave', function () {
        const tooltipEl = document.querySelector('.tooltip');
        if (tooltipEl) {
            tooltipEl.remove();
        }
    });
});
