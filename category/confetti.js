document.addEventListener('DOMContentLoaded', function() {
    // Add confetti animation when the modal opens
    const modal = document.getElementById('rentModal');
    if (modal) {
        modal.addEventListener('show.bs.modal', function() {
            // Create confetti animation
            const canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
                pointer-events: none;
            `;
            document.body.appendChild(canvas);

            // Create confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [
                    '#ff0000',
                    '#00ff00',
                    '#0000ff',
                    '#ffff00',
                    '#ff00ff',
                    '#00ffff'
                ],
                target: 'confettiCanvas'
            });

            // Remove canvas after animation
            setTimeout(() => {
                canvas.remove();
            }, 2000);

            // Add a welcome message
            const modalBody = document.querySelector('.modal-body');
            if (modalBody) {
                const welcomeMessage = document.createElement('div');
                welcomeMessage.className = 'welcome-message';
                welcomeMessage.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    z-index: 10000;
                    text-align: center;
                `;
                welcomeMessage.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Your Rental!';
                modalBody.appendChild(welcomeMessage);

                // Remove welcome message after 2 seconds
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 2000);
            }
        });
    }

    // Add confetti animation and thank you popup when confirm rental is clicked
    const confirmButton = document.querySelector('.confirm-rental');
    if (confirmButton) {
        confirmButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Play success sound
            const successSound = new Audio('Apple Pay Success Sound Effect.mp3');
            successSound.play();

            // Create confetti animation
            const canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
                pointer-events: none;
            `;
            document.body.appendChild(canvas);

            // Create confetti animation
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [
                    '#ff0000',
                    '#00ff00',
                    '#0000ff',
                    '#ffff00',
                    '#ff00ff',
                    '#00ffff'
                ],
                target: 'confettiCanvas'
            });

            // Remove canvas after animation
            setTimeout(() => {
                canvas.remove();
            }, 2000);

            // Create thank you popup
            const popup = document.createElement('div');
            popup.className = 'thank-you-popup';
            popup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;

            // Create thank you message
            const message = document.createElement('div');
            message.className = 'thank-you-message';
            message.style.cssText = `
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                animation: fadeIn 0.5s ease-in;
            `;
            message.innerHTML = `
                <i class="fas fa-heart" style="color: #ff0000; font-size: 40px; margin-bottom: 20px;"></i>
                <h2 style="color: #333;">Thank You for Choosing Our Service!</h2>
                <p style="color: #666;">We appreciate your business and look forward to serving you.</p>
                <button class="close-popup" style="
                    background: #ff0000;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                ">Close</button>
            `;

            // Add close button functionality
            const closeButton = message.querySelector('.close-popup');
            closeButton.addEventListener('click', function() {
                // Create confetti animation
                const canvas = document.createElement('canvas');
                canvas.id = 'confettiCanvas';
                canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 99999;
                    pointer-events: none;
                `;
                document.body.appendChild(canvas);

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [
                        '#ff0000',
                        '#00ff00',
                        '#0000ff',
                        '#ffff00',
                        '#ff00ff',
                        '#00ffff'
                    ],
                    target: 'confettiCanvas'
                });

                // Remove canvas after animation
                setTimeout(() => {
                    canvas.remove();
                }, 2000);

                // Create thank you message
                const thanksMessage = document.createElement('div');
                thanksMessage.className = 'thanks-message';
                thanksMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 255, 255, 0.9);
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    z-index: 10001;
                    animation: fadeIn 0.5s ease-in;
                `;
                thanksMessage.innerHTML = `
                    <i class="fas fa-smile" style="color: #4CAF50; font-size: 40px; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin: 0;">Thank you for using our service!</h2>
                    <p style="color: #666; margin: 10px 0;">We appreciate your business!</p>
                `;

                // Add thanks message to body
                document.body.appendChild(thanksMessage);

                // Remove popup and redirect after 3 seconds
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.remove();
                    }
                    if (thanksMessage.parentNode) {
                        thanksMessage.remove();
                    }
                    
                    // Create another confetti animation before redirecting
                    confetti({
                        particleCount: 200,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: [
                            '#ff0000',
                            '#00ff00',
                            '#0000ff',
                            '#ffff00',
                            '#ff00ff',
                            '#00ffff'
                        ]
                    });

                    // Redirect to home page after 1 second
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }, 3000);
            });

            // Add message to popup
            popup.appendChild(message);
            
            // Add popup to body
            document.body.appendChild(popup);

            // Remove popup after 5 seconds if not closed
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 5000);
        });
    }
});
