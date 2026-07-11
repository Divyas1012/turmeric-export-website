/**
 * GOLDEN CANOPY AGRITECH - CORE JAVASCRIPT
 * Interactivity: Sticky Nav, Mobile Hamburger, Image Carousels, 
 * Lightbox, Form Validation & Scroll Reveal Animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY NAVBAR & MOVEMENT
     ========================================================================== */
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial call on load

  /* ==========================================================================
     2. MOBILE MENU NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('active');
    navbar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    navbar.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* Close mobile menu when clicking outside of navbar/toggle */
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. PRODUCT CAROUSELS (SLIDER MECHANICS)
     ========================================================================== */
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let autoPlayTimer = null;
    const intervalTime = 5000; // 5 seconds per slide

    const updateCarousel = (index) => {
      // Handle wrap-around bounds
      if (index >= slides.length) currentIndex = 0;
      else if (index < 0) currentIndex = slides.length - 1;
      else currentIndex = index;

      // Update slide active classes
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update active indicators (dots)
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      updateCarousel(currentIndex + 1);
    };

    const prevSlide = () => {
      updateCarousel(currentIndex - 1);
    };

    // Button event listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Dots event listeners
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoplay();
      });
    });

    // Autoplay implementation
    const startAutoplay = () => {
      autoPlayTimer = setInterval(nextSlide, intervalTime);
    };

    const stopAutoplay = () => {
      clearInterval(autoPlayTimer);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // Pause autoplay on mouse hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Initial setup
    startAutoplay();
  });

  /* ==========================================================================
     4. CERTIFICATION LIGHTBOX MODAL & DOWNLOAD SECURITY
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const certCards = document.querySelectorAll('.certificate-card');

  // Open Lightbox Function
  const openLightbox = (imageSrc, altText) => {
    lightboxImg.src = imageSrc;
    lightboxImg.alt = altText;
    lightboxModal.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  // Close Lightbox Function
  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    // Clear image src after transition to prevent flicker on reopen
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const imageSrc = card.getAttribute('data-cert');
      const altText = card.querySelector('.cert-img').alt;
      openLightbox(imageSrc, altText);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close when clicking modal backdrop
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-shield') || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* Secure Certificates: Disable Right-click and Drags to prevent saving */
  const securityHandler = (e) => {
    e.preventDefault();
    return false;
  };

  // Protect thumbnail cards
  const certImages = document.querySelectorAll('.cert-img, .cert-shield');
  certImages.forEach(elem => {
    elem.addEventListener('contextmenu', securityHandler);
    elem.addEventListener('dragstart', securityHandler);
  });

  // Protect lightbox modal content
  const modalProtectedElements = [lightboxImg, document.getElementById('lightbox-shield')];
  modalProtectedElements.forEach(elem => {
    if (elem) {
      elem.addEventListener('contextmenu', securityHandler);
      elem.addEventListener('dragstart', securityHandler);
    }
  });

  /* ==========================================================================
     5. CONTACT FORM VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form-btn');
    
    // Form input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    // Input regex patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[\d\s()+-]{7,20}$/; // Basic validation: digits, spaces, parentheses, dashes, plus sign

    // Helper validation status setters
    const setInputError = (input, message) => {
      const formGroup = input.closest('.form-group');
      const errorDisplay = formGroup.querySelector('.error-msg');
      formGroup.classList.remove('success');
      formGroup.classList.add('error');
      if (errorDisplay) {
        errorDisplay.textContent = message;
      }
    };

    const setInputSuccess = (input) => {
      const formGroup = input.closest('.form-group');
      formGroup.classList.remove('error');
      formGroup.classList.add('success');
    };

    // Form input validation rules
    const validateName = () => {
      const value = nameInput.value.trim();
      if (!value) {
        setInputError(nameInput, 'Full Name is required.');
        return false;
      } else if (value.length < 3) {
        setInputError(nameInput, 'Name must be at least 3 characters long.');
        return false;
      }
      setInputSuccess(nameInput);
      return true;
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      if (!value) {
        setInputError(emailInput, 'Email Address is required.');
        return false;
      } else if (!emailRegex.test(value)) {
        setInputError(emailInput, 'Please enter a valid email address.');
        return false;
      }
      setInputSuccess(emailInput);
      return true;
    };

    const validatePhone = () => {
      const value = phoneInput.value.trim();
      if (!value) {
        setInputError(phoneInput, 'Phone Number is required.');
        return false;
      } else if (!phoneRegex.test(value)) {
        setInputError(phoneInput, 'Please enter a valid phone number (digits and spaces/brackets).');
        return false;
      }
      setInputSuccess(phoneInput);
      return true;
    };

    const validateMessage = () => {
      const value = messageInput.value.trim();
      if (!value) {
        setInputError(messageInput, 'Inquiry message is required.');
        return false;
      } else if (value.length < 15) {
        setInputError(messageInput, 'Please provide more details (min 15 characters).');
        return false;
      }
      setInputSuccess(messageInput);
      return true;
    };

    // Live input validation listeners
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    messageInput.addEventListener('input', validateMessage);

    // Form Submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger all validations
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isMessageValid = validateMessage();

      const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;

      if (isFormValid) {
        // Simulate form submission to export database (API endpoints would go here)
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // Visual feedback loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Inquiry <i class="fa-solid fa-spinner fa-spin"></i>';

        setTimeout(() => {
          // Success Actions
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          // Reset inputs visual classes
          const groups = contactForm.querySelectorAll('.form-group');
          groups.forEach(g => g.classList.remove('success', 'error'));

          // Toggle success state layout
          formSuccess.classList.add('active');
          contactForm.style.display = 'none';
          contactForm.reset();
        }, 1500); // 1.5 seconds mock delay
      } else {
        // Scroll to first invalid input field
        const firstError = contactForm.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Reset Success Card to allow multiple submissions
    resetFormBtn.addEventListener('click', () => {
      formSuccess.classList.remove('active');
      contactForm.style.display = 'block';
    });
  }

  /* ==========================================================================
     5a. DEDICATED ORDER CONFIGURATOR MECHANICS
     ========================================================================== */
  const orderProductSelect = document.getElementById('order-product-select');
  const orderQuantityInput = document.getElementById('order-quantity');
  const orderShippingSelect = document.getElementById('order-shipping');
  
  const calcUnitPrice = document.getElementById('calc-unit-price');
  const calcShippingPrice = document.getElementById('calc-shipping-price');
  const calcTotalPrice = document.getElementById('calc-total-price');
  const minOrderNote = document.getElementById('min-order-note');
  
  const orderFormState = document.getElementById('order-form-state');
  const orderSuccessState = document.getElementById('order-success-state');
  const orderSubmitForm = document.getElementById('order-submit-form');
  const orderSuccessResetBtn = document.getElementById('order-success-reset-btn');
  
  // Product details preview variables
  const orderPreviewImg = document.getElementById('order-preview-img');
  const orderPreviewTitle = document.getElementById('order-preview-title');
  const orderPreviewSpecs = document.getElementById('order-preview-specs');

  // Product configuration: Base Price, Minimum Order (Tons)
  const productConfig = {
    fingers: { 
      price: 115000, 
      min: 10, 
      name: 'Turmeric Fingers',
      img: 'images/fingers/fingers-1.jpg',
      specs: [
        'Curcumin Content: 3.5% to 5.0%',
        'Moisture Level: Max 10%',
        'Packaging Standard: 25kg / 50kg Jute Bags'
      ]
    },
    powder: { 
      price: 140000, 
      min: 5, 
      name: 'Turmeric Powder',
      img: 'images/powder/powder-1.jpg',
      specs: [
        'Curcumin Content: 3.0% to 4.5%',
        'Moisture Level: Max 9%',
        'Packaging Standard: Kraft Paper Bags with Liner'
      ]
    },
    organic: { 
      price: 205000, 
      min: 2, 
      name: 'Organic Turmeric Powder',
      img: 'images/organic/organic-1.jpg',
      specs: [
        'Curcumin Content: 4.5% to 6.0%',
        'Moisture Level: Max 8.5%',
        'Packaging Standard: Eco-friendly Multiwall Bags'
      ]
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  // Recalculate Live Quote
  const recalculateQuote = () => {
    if (!orderProductSelect || !orderQuantityInput || !orderShippingSelect) return;
    
    const productKey = orderProductSelect.value;
    const config = productConfig[productKey];
    if (!config) return;
    
    // Validate quantity constraints
    let qty = parseInt(orderQuantityInput.value) || 0;
    if (qty < config.min) {
      qty = config.min;
      orderQuantityInput.value = qty;
    }
    
    const basePrice = config.price;
    const shippingOption = orderShippingSelect.options[orderShippingSelect.selectedIndex];
    const shippingExtra = parseInt(shippingOption.getAttribute('data-extra')) || 0;
    
    const unitPrice = basePrice;
    const totalPrice = (unitPrice + shippingExtra) * qty;
    
    // Update live panel
    if (calcUnitPrice) calcUnitPrice.textContent = `${formatCurrency(unitPrice)} / MT`;
    if (calcShippingPrice) calcShippingPrice.textContent = `${formatCurrency(shippingExtra)} / MT`;
    if (calcTotalPrice) calcTotalPrice.textContent = formatCurrency(totalPrice);
    
    // Update product specs previews
    if (orderPreviewImg) orderPreviewImg.src = config.img;
    if (orderPreviewTitle) orderPreviewTitle.textContent = config.name;
    if (orderPreviewSpecs) {
      orderPreviewSpecs.innerHTML = config.specs.map(spec => {
        const parts = spec.split(':');
        return `<li><span>${parts[0]}:</span>${parts[1]}</li>`;
      }).join('');
    }
    
    return {
      productName: config.name,
      quantity: qty,
      shippingTerm: shippingOption.value,
      total: totalPrice
    };
  };

  // Handle URL parameters to pre-populate selections
  const handleURLParams = () => {
    if (!orderProductSelect) return;
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    
    if (productParam && productConfig[productParam]) {
      orderProductSelect.value = productParam;
    }
    
    // Trigger initial settings
    const currentKey = orderProductSelect.value;
    const config = productConfig[currentKey];
    if (config) {
      orderQuantityInput.min = config.min;
      orderQuantityInput.value = config.min;
      if (minOrderNote) minOrderNote.textContent = `Minimum order requirement: ${config.min} MT`;
    }
    
    recalculateQuote();
  };

  // Attach event listeners for configurator inputs
  if (orderProductSelect) {
    orderProductSelect.addEventListener('change', () => {
      const productKey = orderProductSelect.value;
      const config = productConfig[productKey];
      if (config) {
        orderQuantityInput.min = config.min;
        orderQuantityInput.value = config.min;
        if (minOrderNote) minOrderNote.textContent = `Minimum order requirement: ${config.min} MT`;
      }
      recalculateQuote();
    });
  }
  
  if (orderQuantityInput) orderQuantityInput.addEventListener('input', recalculateQuote);
  if (orderShippingSelect) orderShippingSelect.addEventListener('change', recalculateQuote);

  // Validation functions for order form inputs
  const orderName = document.getElementById('order-name');
  const orderCompany = document.getElementById('order-company');
  const orderEmail = document.getElementById('order-email');
  const orderPhone = document.getElementById('order-phone');
  const orderPort = document.getElementById('order-port');

  const setOrderError = (input, msg) => {
    const group = input.closest('.form-group');
    const err = group.querySelector('.error-msg');
    group.classList.remove('success');
    group.classList.add('error');
    if (err) err.textContent = msg;
  };

  const setOrderSuccess = (input) => {
    const group = input.closest('.form-group');
    group.classList.remove('error');
    group.classList.add('success');
  };

  const validateOrderForm = () => {
    let isValid = true;
    
    if (!orderName || !orderCompany || !orderEmail || !orderPhone || !orderPort) return false;
    
    if (!orderName.value.trim()) {
      setOrderError(orderName, 'Contact person name is required.');
      isValid = false;
    } else {
      setOrderSuccess(orderName);
    }
    
    if (!orderCompany.value.trim()) {
      setOrderError(orderCompany, 'Company name is required.');
      isValid = false;
    } else {
      setOrderSuccess(orderCompany);
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!orderEmail.value.trim()) {
      setOrderError(orderEmail, 'Business email address is required.');
      isValid = false;
    } else if (!emailPattern.test(orderEmail.value.trim())) {
      setOrderError(orderEmail, 'Please enter a valid corporate email.');
      isValid = false;
    } else {
      setOrderSuccess(orderEmail);
    }

    if (!orderPhone.value.trim()) {
      setOrderError(orderPhone, 'Phone number is required.');
      isValid = false;
    } else {
      setOrderSuccess(orderPhone);
    }

    if (!orderPort.value.trim()) {
      setOrderError(orderPort, 'Destination discharge port is required.');
      isValid = false;
    } else {
      setOrderSuccess(orderPort);
    }

    return isValid;
  };

  // Handle order form submission
  if (orderSubmitForm) {
    orderSubmitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateOrderForm()) {
        const submitBtn = document.getElementById('order-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing Request <i class="fa-solid fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          
          // Retrieve calculated details
          const quoteDetails = recalculateQuote();
          
          // Populate summary invoice
          document.getElementById('order-ref-number').textContent = `GCA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
          document.getElementById('summary-product').textContent = quoteDetails.productName;
          document.getElementById('summary-quantity').textContent = `${quoteDetails.quantity} Metric Tons`;
          document.getElementById('summary-shipping').textContent = quoteDetails.shippingTerm;
          document.getElementById('summary-port').textContent = orderPort.value;
          document.getElementById('summary-total').textContent = formatCurrency(quoteDetails.total);
          
          // Switch display layouts
          orderFormState.style.display = 'none';
          orderSuccessState.style.display = 'block';
          
          // Scroll up to success details smoothly
          document.getElementById('order-workspace-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
      }
    });
  }

  // Handle success state reset buttons
  if (orderSuccessResetBtn) {
    orderSuccessResetBtn.addEventListener('click', () => {
      orderSuccessState.style.display = 'none';
      orderFormState.style.display = 'block';
      if (orderSubmitForm) orderSubmitForm.reset();
      handleURLParams();
    });
  }

  // Run on page initializations
  handleURLParams();

  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,      // Trigger when 10% of element is in view
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is centered
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  /* ==========================================================================
     7. NAVIGATION ACTIVE SECTION OBSERVER (SCROLL HIGHLIGHTING)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navObserverOptions = {
    threshold: 0.3, // Trigger when 30% of section is visible
    rootMargin: '-80px 0px 0px 0px' // Adjust scroll offset corresponding to header
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') && link.getAttribute('href').endsWith('#' + id)) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

});
