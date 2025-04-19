document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        childName: document.getElementById('childName').value.trim(),
        age: document.getElementById('age').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        category: document.getElementById('category').value
    };

    // Basic validation
    if (!validateForm(formData)) return;

    // Initialize Paystack payment
    const paymentHandler = PaystackPop.setup({
        key: pk_live_c4db143d371ee8ff7175b5769e42d23a5948ea20,
        email: formData.email,
        amount: config.AMOUNT,
        currency: config.CURRENCY,
        ref: generateReference(),
        callback: function(response) {
            handlePaymentSuccess(response, formData);
        },
        onClose: function() {
            handlePaymentClose();
        }
    });
    
    paymentHandler.openIframe();
});

function validateForm(data) {
    if (!data.childName || !data.age || !data.email || !data.phone || !data.category) {
        alert('Please fill in all required fields');
        return false;
    }
    if (data.age < 5 || data.age > 18) {
        alert('Please enter a valid age between 5 and 18');
        return false;
    }
    if (!validateEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}

function generateReference() {
    return 'KIDTECH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function handlePaymentSuccess(response, formData) {
    const message = `New Registration:
Name: ${formData.childName}
Age: ${formData.age}
Email: ${formData.email}
Phone: ${formData.phone}
Category: ${formData.category}
Payment Ref: ${response.reference}
Transaction ID: ${response.transaction}`;

    const whatsappURL = `https://wa.me/${2349075328722}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappURL;
}

function handlePaymentClose() {
    if (confirm('Payment window closed. Would you like to try again?')) {
        document.getElementById('registerBtn').click();
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
                }

// Testimonial Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoSlideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    // Navigation functions
    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        currentIndex = (index + slides.length) % slides.length;
        
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners
    document.querySelector('.next-btn').addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Start auto-slide
    startAutoSlide();

    // Pause on hover
    const carousel = document.querySelector('.testimonial-carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});

// Add to script.js
function scrollToRegistration() {
  const formSection = document.querySelector('.registration');
  formSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
  
  // Optional: Add focus to first form field
  document.getElementById('childName').focus();
}

// Optional: Add keyboard accessibility
document.querySelector('.scroll-down-btn').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    scrollToRegistration();
  }
});


