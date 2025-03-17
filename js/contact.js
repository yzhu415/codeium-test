// Initialize EmailJS
(function() {
    // Public key is exposed in client-side code, but that's okay as EmailJS requires it
    emailjs.init('0PE5MBxw8IYUjgRm8');
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Send email using EmailJS
    emailjs.send('service_4z7bvjm', 'template_jr2zbwg', {
        from_name: name,
        reply_to: email,
        message: message,
        to_email: 'yzhu415@gmail.com'
    })
    .then(function() {
        // Show success message
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
        
        // Clear form
        document.getElementById('contact-form').reset();
        
        // Hide success message after 5 seconds
        setTimeout(function() {
            document.getElementById('success-message').style.display = 'none';
        }, 5000);
    })
    .catch(function(error) {
        // Show error message
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        console.error('EmailJS error:', error);
    })
    .finally(function() {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
});
