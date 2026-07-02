/* ==========================================================================
   INTERACTIVE LOGIC & ANIMATIONS - ANSIL SAJAD K
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initScrollAnimations();
    initCanvasParticles();
    initContactForm();
});


/* ==========================================================================
   CUSTOM LOADER & NAME REVEAL
   ========================================================================== */
function initLoader() {
    const nameContainer = document.getElementById('loader-name');
    const subtitle = document.querySelector('.loader-subtitle');
    const loaderWrapper = document.getElementById('loader-wrapper');
    
    if (!nameContainer) return;
    
    // Split the name text into individual character spans for staggered animations
    const nameText = nameContainer.textContent.trim();
    nameContainer.innerHTML = '';
    
    nameText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        // Handle whitespace characters
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }
        
        // Highlight specific letters (e.g., 'A', 'S', 'K') for premium aesthetic
        if (char === 'A' || char === 'S' || char === 'K') {
            span.classList.add('glow-text');
        }
        
        // Staggered delay for each letter
        span.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        span.style.transitionDelay = `${index * 80}ms`;
        nameContainer.appendChild(span);
    });

    // Animate characters in
    setTimeout(() => {
        const spans = nameContainer.querySelectorAll('span');
        spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
            span.style.filter = 'blur(0)';
        });
        
        // Show subtitle after letters
        if (subtitle) {
            subtitle.style.opacity = '1';
        }
    }, 100);

    // Fade out loader and initialize website sections
    setTimeout(() => {
        loaderWrapper.classList.add('fade-out');
        // Delay overflow unlock to prevent scroll glitch during fade-out
        setTimeout(() => {
            document.body.style.overflowY = 'auto';
            // Trigger scroll animation check for elements in initial view
            window.dispatchEvent(new Event('scroll'));
        }, 600);
    }, 2800);
}

/* ==========================================================================
   STICKY NAVBAR & MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('header-nav');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');

    // Sticky Navbar and Back-To-Top button appearance
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        highlightNavOnScroll();
    });

    // Mobile Hamburger Menu Click Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll locking when mobile menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Auto-close mobile drawer when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Scroll to Top Listener
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active Section Link Highlighting
    const sections = document.querySelectorAll('section');
    function highlightNavOnScroll() {
        let scrollPosition = window.scrollY + 120; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ==========================================================================
   SCROLL REVEAL & SKILLS PROGRESS ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    const skillSection = document.getElementById('skills');
    let skillsAnimated = false;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the skills section, animate progress bars
                if (entry.target === skillSection && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        elementObserver.observe(element);
    });
    
    if (skillSection) {
        elementObserver.observe(skillSection);
    }
}

function animateSkills() {
    const skillBars = document.querySelectorAll('.progress-bar-fill');
    skillBars.forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        bar.style.width = `${percent}%`;
    });
}

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE SYSTEM (Hero Background)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 120 // Mouse interaction zone radius
    };

    // Track mouse positioning within Hero section
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize handler
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);

    // Particle Object blueprint
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Check particle position, check mouse relation, update position
        update() {
            // Collision detection with canvas boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse proximity repulsion effect
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            
            this.draw();
        }
    }

    // Initialize particle pool
    function initParticles() {
        particlesArray = [];
        // Calculate particle count relative to screen area (responsive densities)
        const densityFactor = window.innerWidth < 768 ? 0.00004 : 0.00007;
        const numberOfParticles = Math.min(Math.floor(canvas.width * canvas.height * densityFactor), 80);
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 2 + 1; // 1px to 3px
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2; // slow speeds
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Randomly choose primary blue or purple color scheme
            let color = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.45)' : 'rgba(168, 85, 247, 0.45)';
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles close to each other with custom translucent lines
    function connect() {
        let maxDistance = 110;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    // Line opacity diminishes as nodes separate
                    let opacity = (1 - (distance / maxDistance)) * 0.15;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    // Setup initial canvas dimensions and launch
    resizeCanvas();
    animate();
}

/* ==========================================================================
   CONTACT FORM HANDLING (Mock Validation & Submission)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // Validation
        if (!name || !email || !message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Loading state
        if (submitBtn) {
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        }

        const params = {
            name: name,
            email: email,
            message: message
        };

        emailjs.send("service_h0h9sun", "template_2h1amv6", params)
            .then(function () {
                showStatus('Message sent successfully!', 'success');
                form.reset();
            })
            .catch(function(error) {
                console.log("FULL ERROR:", error);
                alert(JSON.stringify(error));
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status';
        formStatus.classList.add(type);
        formStatus.style.display = 'block';

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}