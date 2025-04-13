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
        key: config.PAYSTACK_PUBLIC_KEY,
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

    const whatsappURL = `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
