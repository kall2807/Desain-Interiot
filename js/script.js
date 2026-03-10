// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link
const navLinks = document.querySelectorAll('.nav-link');
const currentPath = window.location.pathname.split('/').pop();

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
        link.classList.add('active');
    } else if (currentPath === '' && linkPath === 'index.html') {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Estimator (Homepage)
const estArea = document.getElementById('estArea');
const estType = document.getElementById('estType');
const estLevel = document.getElementById('estLevel');
const estMaterial = document.getElementById('estMaterial');
const estCalcBtn = document.getElementById('estCalcBtn');
const estResetBtn = document.getElementById('estResetBtn');
const estTotal = document.getElementById('estTotal');
const estPerM2 = document.getElementById('estPerM2');
const estDuration = document.getElementById('estDuration');

const formatRupiah = (num) => {
    const n = Math.max(0, Math.round(num || 0));
    return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const baseRates = {
    design_planning: 650000,
    standard_interior: 2500000,
    premium_interior: 3500000,
};

const levelMult = {
    basic: 0.85,
    standard: 1.0,
    premium: 1.25,
};

const materialMult = {
    no: 1.0,
    yes: 1.35,
};

const durationPerM2 = {
    design_planning: 0.25,
    standard_interior: 0.6,
    premium_interior: 0.75,
};

const calcEstimation = () => {
    if (!estArea || !estType || !estLevel || !estMaterial || !estTotal || !estPerM2 || !estDuration) return;

    const area = parseFloat(estArea.value || '0');
    const type = estType.value;
    const level = estLevel.value;
    const material = estMaterial.value;

    if (!area || area <= 0) {
        estTotal.textContent = 'Rp 0';
        estPerM2.textContent = 'Rp 0';
        estDuration.textContent = '-';
        return;
    }

    const rate = (baseRates[type] || 0) * (levelMult[level] || 1) * (materialMult[material] || 1);
    const total = rate * area;

    const days = Math.max(7, Math.round(area * (durationPerM2[type] || 0.7)));
    const weeks = Math.max(1, Math.round(days / 7));

    estPerM2.textContent = formatRupiah(rate);
    estTotal.textContent = formatRupiah(total);
    estDuration.textContent = weeks + ' minggu';
};

if (estCalcBtn) {
    estCalcBtn.addEventListener('click', calcEstimation);
}
if (estResetBtn) {
    estResetBtn.addEventListener('click', () => {
        if (estArea) estArea.value = '';
        if (estType) estType.value = 'standard_interior';
        if (estLevel) estLevel.value = 'standard';
        if (estMaterial) estMaterial.value = 'no';
        calcEstimation();
    });
}

// Auto update on change
[estArea, estType, estLevel, estMaterial].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
        if (el !== estArea) calcEstimation();
    });
    el.addEventListener('change', calcEstimation);
});

// Scroll to Top Button
const scrollTopBtn = document.createElement('div');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Mohon masukkan email yang valid', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.maxHeight = '0';
                faqItem.querySelector('.faq-answer').style.padding = '0';
                faqItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '15px 0';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .team-member, .stat-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        }
    };
    
    updateCounter();
};

// Initialize counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    animateCounter(stat, number);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Form input animations
const formInputs = document.querySelectorAll('input, textarea, select');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Check if input has value on load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Add CSS for focused state
const focusedStyles = document.createElement('style');
focusedStyles.textContent = `
    .form-group.focused label {
        color: #3498db;
        transform: translateY(-25px);
        font-size: 0.9rem;
    }
    
    .form-group {
        position: relative;
    }
    
    .form-group label {
        transition: all 0.3s ease;
        position: absolute;
        left: 15px;
        top: 15px;
        background: white;
        padding: 0 5px;
    }
    
    .form-group input:focus + label,
    .form-group textarea:focus + label,
    .form-group select:focus + label,
    .form-group.focused label {
        transform: translateY(-25px);
        font-size: 0.9rem;
        color: #3498db;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
    }
    
    .faq-question i {
        transition: transform 0.3s ease;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
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
`;
document.head.appendChild(focusedStyles);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('InteriorSpace website loaded successfully');

    // Hero Slider (Homepage)
    const heroTrack = document.getElementById('heroSliderTrack');
    const heroDotsContainer = document.getElementById('heroSliderDots');
    const heroPrev = document.querySelector('.hero-slider .slider-prev');
    const heroNext = document.querySelector('.hero-slider .slider-next');

    if (heroTrack && heroDotsContainer && heroPrev && heroNext) {
        const getSlideWidth = () => heroTrack.clientWidth;

        const getRealSlides = () => Array.from(heroTrack.querySelectorAll('.slide')).filter(s => !s.dataset.clone);
        const realSlidesInitial = getRealSlides();
        let realCount = realSlidesInitial.length;

        // Build clones for infinite loop
        if (realCount > 1) {
            const firstClone = realSlidesInitial[0].cloneNode(true);
            firstClone.dataset.clone = 'true';
            const lastClone = realSlidesInitial[realCount - 1].cloneNode(true);
            lastClone.dataset.clone = 'true';
            heroTrack.insertBefore(lastClone, heroTrack.firstChild);
            heroTrack.appendChild(firstClone);
        }

        // We start at real index 0, but offset by 1 because of the leading clone.
        let activeIndex = 0;

        const scrollToRealIndex = (index, behavior = 'smooth') => {
            if (realCount <= 1) {
                activeIndex = 0;
                heroTrack.scrollTo({ left: 0, behavior });
                updateDots();
                return;
            }

            const wrapped = ((index % realCount) + realCount) % realCount;
            activeIndex = wrapped;
            const physicalIndex = wrapped + 1;
            heroTrack.scrollTo({ left: physicalIndex * getSlideWidth(), behavior });
            updateDots();
        };

        const updateDots = () => {
            const dots = Array.from(heroDotsContainer.querySelectorAll('.slider-dot'));
            dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
        };

        // Build dots
        heroDotsContainer.innerHTML = '';
        realSlidesInitial.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => scrollToRealIndex(i));
            heroDotsContainer.appendChild(dot);
        });

        heroPrev.addEventListener('click', () => scrollToRealIndex(activeIndex - 1));
        heroNext.addEventListener('click', () => scrollToRealIndex(activeIndex + 1));

        // Position to first real slide
        scrollToRealIndex(0, 'auto');

        // Sync index on scroll (snap)
        let scrollTimeout;
        heroTrack.addEventListener('scroll', () => {
            window.clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                if (realCount <= 1) {
                    activeIndex = 0;
                    updateDots();
                    return;
                }

                const physicalIndex = Math.round(heroTrack.scrollLeft / getSlideWidth());

                // If at clones, jump (no animation) to corresponding real slide
                if (physicalIndex === 0) {
                    // leading clone (last)
                    heroTrack.scrollTo({ left: realCount * getSlideWidth(), behavior: 'auto' });
                    activeIndex = realCount - 1;
                    updateDots();
                    return;
                }
                if (physicalIndex === realCount + 1) {
                    // trailing clone (first)
                    heroTrack.scrollTo({ left: 1 * getSlideWidth(), behavior: 'auto' });
                    activeIndex = 0;
                    updateDots();
                    return;
                }

                // Normal range: 1..realCount
                activeIndex = Math.max(0, Math.min(physicalIndex - 1, realCount - 1));
                updateDots();
            }, 80);
        });

        // Keep position correct on resize
        window.addEventListener('resize', () => {
            if (realCount <= 1) {
                heroTrack.scrollTo({ left: 0, behavior: 'auto' });
                return;
            }
            heroTrack.scrollTo({ left: (activeIndex + 1) * getSlideWidth(), behavior: 'auto' });
        });
    }
});
