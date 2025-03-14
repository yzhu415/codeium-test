// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Language switching functionality
function setLanguage(lang) {
    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

// Modal functionality
const modal = document.getElementById('contactModal');
const ctaButton = document.querySelector('.cta-button');
const closeButton = document.querySelector('.close-button');
const contactForm = document.getElementById('contactForm');

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

ctaButton.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Create email content
    const subject = `Personal Website Inquiry from ${formData.name}`;
    const body = `Name: ${formData.name}
Company: ${formData.company}
Email: ${formData.email}

Message:
${formData.message}`;

    // Create mailto URL
    const mailtoUrl = `mailto:yzhu415@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    // Show success message and close modal
    setTimeout(() => {
        alert('Thank you for your interest! Opening your email client...');
        contactForm.reset();
        closeModal();
    }, 100);
});

// Add click handlers to language buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Initialize with saved language preference or default to English
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLang);
});
