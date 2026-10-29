/* ================================================================
   NITR CAMPUSCARE — ENHANCED MOTION & SCROLL EFFECTS ENGINE
   Different scrolling effects, section-tailored reveals, transitions,
   scroll progress indicator, parallax depth, and animated counters.
================================================================ */

const CampusCare = (function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Robust DOM Ready Setup ---
    function initAll() {
        initScrollProgressBar();
        initScrollToTop();
        initAutoSectionTagging();
        initReveal();
        initMobileNav();
        initParallax();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // --- Scroll Progress Bar at Viewport Top ---
    function initScrollProgressBar() {
        if (document.querySelector('.cc-scroll-progress')) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'cc-scroll-progress';
        progressBar.setAttribute('aria-hidden', 'true');
        progressBar.innerHTML = '<div class="cc-scroll-progress-fill"></div>';
        document.body.appendChild(progressBar);

        const fill = progressBar.querySelector('.cc-scroll-progress-fill');

        let ticking = false;
        function updateProgress() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });

        updateProgress();
    }

    // --- Scroll to Top Floating Button ---
    function initScrollToTop() {
        if (document.querySelector('.cc-scroll-top-btn')) return;

        const topBtn = document.createElement('button');
        topBtn.className = 'cc-scroll-top-btn';
        topBtn.setAttribute('aria-label', 'Scroll back to top');
        topBtn.setAttribute('type', 'button');
        topBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        `;
        document.body.appendChild(topBtn);

        let ticking = false;
        function toggleButton() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 280) {
                topBtn.classList.add('is-visible');
            } else {
                topBtn.classList.remove('is-visible');
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(toggleButton);
                ticking = true;
            }
        }, { passive: true });

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Automatic Section Tagging for Different Section Types ---
    function initAutoSectionTagging() {
        // 1. Hero Content & Banners -> 'hero' effect
        document.querySelectorAll('.hero-content, .page-header, .welcome-banner, .teacher-header').forEach(el => {
            if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'hero');
        });

        // 2. Stats & Metric Ribbons -> 'stats' scale/flip effect + staggered delays
        document.querySelectorAll('.stats, .stat-card, .metric-card, .dashboard-stats, .analytics-grid').forEach((grid) => {
            if (grid.classList.contains('stat-card') || grid.classList.contains('metric-card')) {
                if (!grid.hasAttribute('data-reveal')) grid.setAttribute('data-reveal', 'stats');
            } else {
                const cards = grid.querySelectorAll('.stat-card, .metric-card, .card, > div');
                cards.forEach((card, idx) => {
                    if (!card.hasAttribute('data-reveal')) {
                        card.setAttribute('data-reveal', 'stats');
                        card.setAttribute('data-reveal-delay', (idx * 80).toString());
                    }
                });
            }
        });

        // 3. Service & Department Cards -> 'cascade' tilt & rise
        document.querySelectorAll('.service-grid, .category-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.service-card, .card, > div');
            cards.forEach((card, idx) => {
                if (!card.hasAttribute('data-reveal')) {
                    card.setAttribute('data-reveal', 'cascade');
                    card.setAttribute('data-reveal-delay', (idx * 60).toString());
                }
            });
        });

        // 4. Workflow & Process Steps -> alternating 'slide-left' / 'slide-right'
        document.querySelectorAll('#workflow, .workflow-steps, .resolution-process').forEach(container => {
            const steps = container.querySelectorAll('.card, .step, > div > div');
            steps.forEach((step, idx) => {
                if (!step.hasAttribute('data-reveal')) {
                    const direction = idx % 2 === 0 ? 'slide-left' : 'slide-right';
                    step.setAttribute('data-reveal', direction);
                    step.setAttribute('data-reveal-delay', (idx * 90).toString());
                }
            });
        });

        // 5. Media & Campus Video Sections -> 'media' zoom & focus
        document.querySelectorAll('.campus-video, .video-container, .video-frame, .hero-photo-wrap').forEach(media => {
            if (!media.hasAttribute('data-reveal')) media.setAttribute('data-reveal', 'media');
        });

        // 6. Form Containers & Track Lookups -> 'form' spring entrance
        document.querySelectorAll('.track-card, .auth-card, .register-form, .modal-dialog, .form-container, .login-box').forEach(form => {
            if (!form.hasAttribute('data-reveal')) form.setAttribute('data-reveal', 'form');
        });

        // 7. FAQ Accordions -> 'faq' smooth bottom glide
        document.querySelectorAll('.faq-list, .faq-item').forEach((item, idx) => {
            if (item.classList.contains('faq-item') && !item.hasAttribute('data-reveal')) {
                item.setAttribute('data-reveal', 'faq');
                item.setAttribute('data-reveal-delay', (idx * 70).toString());
            }
        });

        // 8. Table Rows & Grievance Lists -> 'table-row' smooth cascade
        document.querySelectorAll('tbody tr, .complaint-list-item, .my-complaint-card').forEach((row, idx) => {
            if (!row.hasAttribute('data-reveal')) {
                row.setAttribute('data-reveal', 'table-row');
                row.setAttribute('data-reveal-delay', (Math.min(idx, 8) * 45).toString());
            }
        });

        // 9. Timeline / Audit Trail Steps in Complaint Details -> 'timeline'
        document.querySelectorAll('.timeline-step, .status-history-step, .timeline-item').forEach((item, idx) => {
            if (!item.hasAttribute('data-reveal')) {
                item.setAttribute('data-reveal', 'timeline');
                item.setAttribute('data-reveal-delay', (idx * 80).toString());
            }
        });
    }

    // --- Enhanced Scroll Reveal Engine with Different Section Animation Types ---
    function initReveal() {
        initAutoSectionTagging();
        const elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        const vh = window.innerHeight || document.documentElement.clientHeight || 800;

        if (prefersReducedMotion) {
            elements.forEach(el => {
                el.classList.add('is-visible');
                el.classList.remove('reveal-pending');
                animateNumberCounter(el);
            });
            return;
        }

        // 1. Immediately show all elements currently visible in viewport
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh * 0.95) {
                el.classList.add('is-visible');
                el.classList.remove('reveal-pending');
                animateNumberCounter(el);
            } else if (!el.classList.contains('is-visible')) {
                // Below fold: stage for scroll entrance
                el.classList.add('reveal-pending');
            }
        });

        let revealObserver = window.__ccRevealObserver;
        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const delay = parseInt(target.getAttribute('data-reveal-delay') || 0, 10);

                        const activate = () => {
                            target.classList.add('is-visible');
                            target.classList.remove('reveal-pending');
                            animateNumberCounter(target);
                        };

                        if (delay > 0) {
                            setTimeout(activate, delay);
                        } else {
                            activate();
                        }

                        obs.unobserve(target);
                    }
                });
            }, {
                threshold: 0.02,
                rootMargin: "0px 0px -10px 0px"
            });
            window.__ccRevealObserver = revealObserver;

            // Watch for dynamic card & list insertions
            const dynamicObserver = new MutationObserver((mutations) => {
                let shouldScan = false;
                for (const mut of mutations) {
                    if (mut.addedNodes.length > 0) {
                        shouldScan = true;
                        break;
                    }
                }
                if (shouldScan) {
                    initAutoSectionTagging();
                    const currentVh = window.innerHeight || document.documentElement.clientHeight || 800;
                    document.querySelectorAll('[data-reveal]:not(.is-visible):not([data-observed])').forEach(el => {
                        el.setAttribute('data-observed', 'true');
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= currentVh * 0.95) {
                            el.classList.add('is-visible');
                            el.classList.remove('reveal-pending');
                            animateNumberCounter(el);
                        } else {
                            el.classList.add('reveal-pending');
                            revealObserver.observe(el);
                        }
                    });
                }
            });
            dynamicObserver.observe(document.body, { childList: true, subtree: true });
        }

        elements.forEach(el => {
            if (el.classList.contains('reveal-pending') && !el.hasAttribute('data-observed')) {
                el.setAttribute('data-observed', 'true');
                revealObserver.observe(el);
            }
        });

        // Fail-safe: After 400ms, guarantee all elements are visible and nothing is blank
        setTimeout(() => {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.classList.add('is-visible');
                el.classList.remove('reveal-pending');
            });
        }, 400);
    }

    // --- Animated Number Counter when Stat Sections enter Viewport ---
    function animateNumberCounter(container) {
        if (!container) return;
        const numbers = container.querySelectorAll('.font-mono, .stat-number, [data-counter]');
        numbers.forEach(numEl => {
            const rawText = numEl.textContent.trim();
            const numericValue = parseInt(rawText.replace(/[^0-9]/g, ''), 10);
            if (isNaN(numericValue) || numericValue <= 0 || numEl.dataset.counterDone) return;

            numEl.dataset.counterDone = 'true';
            const duration = 1400; // ms
            const startTime = performance.now();
            const suffix = rawText.endsWith('%') ? '%' : (rawText.endsWith('+') ? '+' : '');

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOut * numericValue);

                numEl.textContent = `${currentCount}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    numEl.textContent = `${numericValue}${suffix}`;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // --- Parallax Scrolling on Hero and Accent Layers ---
    function initParallax() {
        if (prefersReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero-image, [data-parallax]');
        if (!parallaxElements.length) return;

        let ticking = false;
        function updateParallax() {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight * 1.5) {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax-speed') || 0.28);
                    const translateY = scrollY * speed;
                    el.style.transform = `translate3d(0, ${translateY}px, 0)`;
                });
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Mobile Nav Drawer ---
    function initMobileNav() {
        const toggles = document.querySelectorAll('.mobile-nav-toggle');
        const menus = document.querySelectorAll('.navbar-nav');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menus.forEach(menu => {
                    const isOpen = menu.classList.toggle('is-open');
                    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.app-navbar')) {
                menus.forEach(menu => menu.classList.remove('is-open'));
                toggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
            }
        });

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menus.forEach(menu => menu.classList.remove('is-open'));
                toggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
            }
        });
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'info', duration = 4000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        } else if (type === 'warning') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        } else {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }

        const titleText = type === 'info' ? 'Notification' : (type.charAt(0).toUpperCase() + type.slice(1));

        toast.innerHTML = `
            ${iconSvg}
            <div class="toast-content">
                <div class="toast-title">${titleText}</div>
                <div>${escapeText(message)}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        const remove = () => {
            toast.classList.remove('is-visible');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        };

        const timer = setTimeout(remove, duration);
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            remove();
        });
    }

    // --- Modal Confirmation Dialog ---
    function showConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            
            const btnClass = danger ? 'btn-danger' : 'btn-primary';
            
            overlay.innerHTML = `
                <div class="modal-dialog">
                    <h3 class="mb-2" style="font-size: 1.25rem;">${escapeText(title)}</h3>
                    <p class="text-muted mb-6" style="font-size: 0.9375rem;">${escapeText(message)}</p>
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn btn-ghost" id="modalCancelBtn">${escapeText(cancelLabel)}</button>
                        <button class="btn ${btnClass}" id="modalConfirmBtn">${escapeText(confirmLabel)}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            requestAnimationFrame(() => {
                overlay.classList.add('is-visible');
            });

            const cleanup = () => {
                overlay.classList.remove('is-visible');
                setTimeout(() => {
                    if (overlay.parentNode) overlay.remove();
                }, 250);
            };

            overlay.querySelector('#modalCancelBtn').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            overlay.querySelector('#modalConfirmBtn').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });
        });
    }

    // --- Subtle Node Network Visual (2D Canvas) ---
    function initHeroVisual(canvas, options = {}) {
        if (!canvas || prefersReducedMotion) return;
        
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let animationFrameId;
        const nodes = [];
        const isMobile = window.innerWidth < 768;
        const numNodes = options.force2D ? (isMobile ? 20 : 35) : (isMobile ? 30 : 60);
        
        function resize() {
            width = canvas.width = canvas.offsetWidth || canvas.parentElement?.offsetWidth || window.innerWidth;
            height = canvas.height = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 600;
        }
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: Math.random() * (width || 800),
                y: Math.random() * (height || 600),
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 1.2
            });
        }

        function draw() {
            if (!width || !height) {
                resize();
            }

            ctx.clearRect(0, 0, width, height);
            
            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < numNodes; i++) {
                for (let j = i + 1; j < numNodes; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        const opacity = (1 - dist / 130) * 0.22;
                        ctx.strokeStyle = `rgba(139, 30, 45, ${opacity})`;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            ctx.fillStyle = `rgba(15, 23, 42, 0.45)`;
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        }
        
        draw();
    }

    function escapeText(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    return {
        toast: showToast,
        confirmDialog: showConfirmDialog,
        initHeroVisual: initHeroVisual,
        reinitScrollReveals: initReveal
    };
})();

window.CampusCare = CampusCare;
