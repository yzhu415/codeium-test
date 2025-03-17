document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.querySelector('.chat-widget');
    const chatBox = document.querySelector('.chat-box');
    const chatButton = document.querySelector('.chat-widget-button');
    const closeButton = document.querySelector('.close-chat');
    const messageForm = document.getElementById('messageForm');

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    // Toggle chat box
    chatButton.addEventListener('click', () => {
        chatBox.classList.add('active');
    });

    closeButton.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });

    // Show toast message
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Handle form submission
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        try {
            const response = await fetch('http://localhost:5000/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast('Message sent successfully!', 'success');
                messageForm.reset();
                setTimeout(() => {
                    chatBox.classList.remove('active');
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showToast(error.message || 'Failed to send message. Please try again.', 'error');
        }
    });

    // Close chat box when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWidget.contains(e.target) && chatBox.classList.contains('active')) {
            chatBox.classList.remove('active');
        }
    });
});
