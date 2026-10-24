/* ==========================================================================
   UK InfoTech - Client-side Interactivity Script
   ========================================================================== */

function init() {
    initThemeToggle();
    initHeaderScroll();
    initMobileMenu();
    initCursorGlow();
    initStatsCounter();
    initTestimonialSlider();
    initScrollSpy();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ==========================================================================
   Theme Toggling (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;
    const body = document.body;
    const root = document.documentElement;

    // Check for saved theme preference, default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    root.className = savedTheme;

    themeToggleBtn.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light-theme' : 'dark-theme';
        const oldTheme = isDark ? 'dark-theme' : 'light-theme';

        body.classList.replace(oldTheme, newTheme);
        root.classList.replace(oldTheme, newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   Header Scroll Background and Height Change
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   Mobile Responsive Navigation Menu
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   Interactive Cursor Glow (Follows Mouse pointer)
   ========================================================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
    });
}

/* ==========================================================================
   Statistics Counting Animation
   ========================================================================== */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 150; // Speed of count animation (lower means faster)

    const startCounting = (stat) => {
        const updateCount = () => {
            const target = +stat.getAttribute('data-target');
            const count = +stat.innerText;
            const inc = Math.ceil(target / speed);

            if (count < target) {
                stat.innerText = count + inc;
                setTimeout(updateCount, 15);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    };

    // Trigger animation when the stats section is in view
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                startCounting(stat);
                observer.unobserve(stat); // Trigger animation only once
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   Accordion Component (Why Choose Us)
   ========================================================================== */
function toggleAccordion(itemId) {
    const items = document.querySelectorAll('.accordion-item');
    const targetItem = document.getElementById(itemId);

    items.forEach(item => {
        if (item.id === itemId) {
            item.classList.toggle('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/* ==========================================================================
   Tech Stack Category Filter
   ========================================================================== */
function filterTech(category) {
    const cards = document.querySelectorAll('.tech-card');
    const buttons = document.querySelectorAll('.tech-tab-btn');

    // Update active tab styling
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Animate filtering grid
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300); // match transition speed
        }
    });
}

/* ==========================================================================
   Testimonials Carousel / Slider
   ========================================================================== */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let autoSlideInterval;

    console.log('Slider initialized:', { slidesCount: slides.length, dotsCount: dots.length, prevBtn, nextBtn });

    const showSlide = (n) => {
        console.log('showSlide called with:', n);
        if (slides.length === 0) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        console.log('currentSlide set to:', currentSlide);
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked');
            nextSlide();
            resetAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Prev button clicked');
            prevSlide();
            resetAutoPlay();
        });
    }

    // Make dot navigation interactive
    window.goToSlide = (slideIndex) => {
        console.log('goToSlide called with:', slideIndex);
        showSlide(slideIndex);
        resetAutoPlay();
    };

    // Auto rotate every 6 seconds
    const startAutoPlay = () => {
        autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoSlideInterval);
        startAutoPlay();
    };

    startAutoPlay();
}

/* ==========================================================================
   Active Navigation Link Highlighting on Scroll (ScrollSpy)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   EmailJS Integration & Form Submission Handling
   ========================================================================== */
const EMAILJS_CONFIG = {
    serviceId: "service_itcompany",
    templateId: "template_ryi1hy7",
    publicKey: "r10lYU0_5BMQtH-Cm"
};

// Initialize EmailJS
(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            if (typeof emailjs !== 'undefined') {
                emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
            }
        });
    }
})();

function showFormAlert(message, type = 'error') {
    const alertBanner = document.getElementById('formAlertBanner');
    if (!alertBanner) return;
    
    alertBanner.className = `form-alert-banner ${type}`;
    const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    alertBanner.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    alertBanner.style.display = 'flex';
}

function clearFormAlert() {
    const alertBanner = document.getElementById('formAlertBanner');
    if (alertBanner) {
        alertBanner.style.display = 'none';
        alertBanner.innerHTML = '';
    }
}

function setFieldError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const errorSpan = document.getElementById(errorId);
    if (group) group.classList.add('has-error');
    if (errorSpan) errorSpan.textContent = message;
}

function clearFieldErrors() {
    document.querySelectorAll('.form-group.has-error, .form-checkbox.has-error').forEach(el => {
        el.classList.remove('has-error');
    });
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
    });
}

// Clear errors when the user interacts with input fields
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('itContactForm');
    if (!form) return;

    form.querySelectorAll('input, select, textarea').forEach(input => {
        const clearCurrentError = () => {
            const group = input.closest('.form-group') || input.closest('.form-checkbox');
            if (group && group.classList.contains('has-error')) {
                group.classList.remove('has-error');
                const err = group.querySelector('.field-error');
                if (err) err.textContent = '';
            }
            clearFormAlert();
        };
        input.addEventListener('input', clearCurrentError);
        input.addEventListener('change', clearCurrentError);
    });
});

function validateConsultationForm() {
    clearFieldErrors();
    clearFormAlert();
    let isValid = true;
    let firstInvalidField = null;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const serviceInput = document.getElementById('contactService');
    const messageInput = document.getElementById('contactMessage');
    const consentInput = document.getElementById('contactConsent');

    // 1. Name validation
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
        setFieldError('groupName', 'nameError', 'Please enter your name.');
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
    } else if (nameVal.length < 2) {
        setFieldError('groupName', 'nameError', 'Name must be at least 2 characters.');
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
    }

    // 2. Email validation
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        setFieldError('groupEmail', 'emailError', 'Please enter your business email.');
        isValid = false;
        firstInvalidField = firstInvalidField || emailInput;
    } else if (!emailRegex.test(emailVal)) {
        setFieldError('groupEmail', 'emailError', 'Please enter a valid email address (e.g. name@company.com).');
        isValid = false;
        firstInvalidField = firstInvalidField || emailInput;
    }

    // 3. Phone validation (optional)
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (phoneVal) {
        const digits = phoneVal.replace(/\D/g, '');
        if (digits.length < 7) {
            setFieldError('groupPhone', 'phoneError', 'Please enter a valid phone number (at least 7 digits).');
            isValid = false;
            firstInvalidField = firstInvalidField || phoneInput;
        }
    }

    // 4. Service validation
    if (!serviceInput || !serviceInput.value) {
        setFieldError('groupService', 'serviceError', 'Please select a required service.');
        isValid = false;
        firstInvalidField = firstInvalidField || serviceInput;
    }

    // 5. Message validation
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal) {
        setFieldError('groupMessage', 'messageError', 'Please describe your requirements.');
        isValid = false;
        firstInvalidField = firstInvalidField || messageInput;
    } else if (messageVal.length < 10) {
        setFieldError('groupMessage', 'messageError', 'Please provide a bit more detail (at least 10 characters).');
        isValid = false;
        firstInvalidField = firstInvalidField || messageInput;
    }

    // 6. Consent validation
    if (consentInput && !consentInput.checked) {
        setFieldError('groupConsent', 'consentError', 'You must agree to the Privacy Policy to proceed.');
        isValid = false;
        firstInvalidField = firstInvalidField || consentInput;
    }

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
    }

    return isValid;
}

function handleFormSubmit(event) {
    event.preventDefault();

    // 1. Client-side validation
    if (!validateConsultationForm()) {
        showFormAlert('Please fix the highlighted fields above and try again.', 'error');
        return;
    }

    const form = document.getElementById('itContactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const modal = document.getElementById('successModal');

    // 2. Ensure EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        showFormAlert('EmailJS service could not be loaded. Please check your internet connection.', 'error');
        return;
    }

    // 3. UI Loading state to prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Details... <i class="fa-solid fa-spinner fa-spin"></i>';

    // 4. Gather form values
    const nameVal = document.getElementById('contactName').value.trim();
    const emailVal = document.getElementById('contactEmail').value.trim();
    const phoneVal = (document.getElementById('contactPhone')?.value.trim()) || 'Not provided';
    const serviceSelect = document.getElementById('contactService');
    const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || serviceSelect.value;
    const messageVal = document.getElementById('contactMessage').value.trim();
    const submissionTime = new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

    // 5. Prepare template parameters
    const templateParams = {
        from_name: nameVal,
        name: nameVal,
        from_email: emailVal,
        email: emailVal,
        reply_to: emailVal,
        phone: phoneVal,
        phone_number: phoneVal,
        service: serviceText,
        required_service: serviceText,
        message: messageVal,
        submission_time: submissionTime,
        submission_date: submissionTime
    };

    // 6. Send email via EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey)
        .then((response) => {
            console.log('EmailJS Success:', response.status, response.text);

            // Restore submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Audit Request <i class="fa-solid fa-paper-plane"></i>';

            // Clear alerts and errors
            clearFormAlert();
            clearFieldErrors();

            // Show success modal
            if (modal) {
                modal.classList.add('open');
            }

            // Reset form only after confirmed success
            form.reset();
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);

            // Restore submit button with retry option
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Retry Submission <i class="fa-solid fa-rotate-right"></i>';

            let errMsg = 'There was an error sending your request. Please try again.';
            if (error && error.text) {
                errMsg = `Failed to send request: ${error.text}. Please check your details and retry.`;
            }

            // Display error banner (form fields remain filled so user does not lose input)
            showFormAlert(errMsg, 'error');
        });
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

