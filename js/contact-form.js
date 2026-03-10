// Contact Form Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // Fix dropdown behavior
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        // Ensure dropdown opens downward
        select.addEventListener('mousedown', function(e) {
            this.size = this.options.length > 8 ? 8 : this.options.length;
        });
        
        select.addEventListener('change', function() {
            this.size = 1;
        });
        
        select.addEventListener('blur', function() {
            this.size = 1;
        });
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Show success message
    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.</span>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(39, 174, 96, 0.3);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 350px;
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 5000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error-message i {
            color: #e74c3c;
        }
        
        .success-message i {
            font-size: 1.2rem;
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #e74c3c;
            background: #fff5f5;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        /* Ensure dropdown opens downward */
        select {
            direction: ltr;
        }
        
        select option {
            direction: ltr;
        }
    `;
    document.head.appendChild(style);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
                showError(this, 'Field ini wajib diisi');
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.classList.add('error');
                    showError(this, 'Format email tidak valid');
                } else {
                    this.classList.remove('error');
                }
            } else {
                this.classList.remove('error');
            }
        });
        
        // Remove error on input
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        contactForm.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Mengirim...</span>';
        
        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
            contactForm.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Kirim Pesan</span>';
            
            // Show success message
            showSuccess();
            
            // Reset form
            contactForm.reset();
            
        }, 2000);
    });
    
    // Character counter for textarea
    const messageField = document.getElementById('message');
    const maxLength = 500;
    
    // Add character counter
    const counterDiv = document.createElement('div');
    counterDiv.className = 'char-counter';
    counterDiv.style.cssText = `
        text-align: right;
        font-size: 0.85rem;
        color: #666;
        margin-top: 0.5rem;
    `;
    messageField.parentNode.appendChild(counterDiv);
    
    function updateCounter() {
        const remaining = maxLength - messageField.value.length;
        counterDiv.textContent = `${messageField.value.length}/${maxLength} karakter`;
        
        if (remaining < 50) {
            counterDiv.style.color = remaining < 20 ? '#e74c3c' : '#f39c12';
        } else {
            counterDiv.style.color = '#666';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    messageField.addEventListener('keyup', updateCounter);
    
    // Phone number formatting
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format: +62 XXX-XXXX-XXXX
        if (value.length > 2) {
            value = '+62 ' + value.substring(2);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '-' + value.substring(7);
        }
        if (value.length > 12) {
            value = value.substring(0, 12) + '-' + value.substring(12);
        }
        
        e.target.value = value;
    });
    
    // Service selection enhancement
    const serviceSelect = document.getElementById('service');
    serviceSelect.addEventListener('change', function() {
        const otherOption = this.value === 'other';
        
        // Add other field if needed
        let otherField = document.getElementById('other-service');
        if (otherOption && !otherField) {
            otherField = document.createElement('input');
            otherField.type = 'text';
            otherField.id = 'other-service';
            otherField.name = 'other-service';
            otherField.placeholder = 'Jelaskan layanan yang Anda butuhkan...';
            otherField.className = 'form-group';
            otherField.style.cssText = `
                margin-top: 1rem;
                width: 100%;
                padding: 1rem 1.25rem;
                border: 2px solid #E6F2FF;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: #FAFBFF;
                color: #2c3e50;
                font-family: inherit;
                box-sizing: border-box;
            `;
            
            this.parentNode.parentNode.appendChild(otherField);
        } else if (!otherOption && otherField) {
            otherField.remove();
        }
    });
});
