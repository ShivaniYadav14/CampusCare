// ===============================================
// NITR CAMPUSCARE — AUTHENTICATION SCRIPT
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // HERO VISUAL (Lightweight Canvas Background)
    // ========================================
    const canvas = document.querySelector("[data-hero-canvas]");
    if (canvas && window.CampusCare && typeof window.CampusCare.initHeroVisual === 'function') {
        window.CampusCare.initHeroVisual(canvas, { force2D: true });
    }

    // ========================================
    // REMEMBERED EMAIL RESTORE
    // ========================================
    const emailInput = document.getElementById("email");
    const rememberCheckbox = document.getElementById("remember");

    try {
        const savedEmail = localStorage.getItem("campuscare_remembered_email");
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    } catch (e) {
        console.warn("Storage access not available:", e);
    }

    // ========================================
    // PASSWORD VISIBILITY TOGGLE
    // ========================================
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isText = passwordInput.type === "text";
            passwordInput.type = isText ? "password" : "text";

            const eyeShow = togglePassword.querySelector(".eye-show");
            const eyeHide = togglePassword.querySelector(".eye-hide");
            if (eyeShow && eyeHide) {
                eyeShow.style.display = isText ? "block" : "none";
                eyeHide.style.display = isText ? "none" : "block";
            }
            togglePassword.setAttribute("aria-label", isText ? "Show password" : "Hide password");
        });
    }

    // ========================================
    // PASSWORD STRENGTH METER
    // ========================================
    const registerPasswordInput = document.getElementById("registerPassword");
    const passwordStrength = document.getElementById("passwordStrength");

    if (registerPasswordInput && passwordStrength) {
        registerPasswordInput.addEventListener("input", () => {
            const val = registerPasswordInput.value;
            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            passwordStrength.dataset.level = val.length === 0 ? "0" : Math.max(1, score);
        });
    }

    // Helper to safely obtain the Supabase auth client bridge
    function getAuthClient() {
        return (typeof window !== "undefined" && window.supabaseClient)
            || (typeof supabaseClient !== "undefined" ? supabaseClient : null)
            || (window.CampusCareAPI && window.CampusCareAPI.supabase);
    }

    // ========================================
    // FORM SWITCHING (LOGIN <-> REGISTER)
    // ========================================
    const showRegisterBtn = document.getElementById("showRegister");
    const showLoginBtn = document.getElementById("showLogin");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const registerRoleSelect = document.getElementById("registerRole");
    const rollNumberLabel = document.getElementById("rollNumberLabel");
    const rollNumberInput = document.getElementById("rollNumber");

    function switchToRegister() {
        if (loginSection && registerSection) {
            loginSection.classList.add("hidden");
            registerSection.classList.remove("hidden");
        }
    }

    function switchToLogin() {
        if (loginSection && registerSection) {
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        }
    }

    if (showRegisterBtn) showRegisterBtn.addEventListener("click", switchToRegister);
    if (showLoginBtn) showLoginBtn.addEventListener("click", switchToLogin);

    // Support URL routing (e.g. login.html#register or login.html?mode=register)
    if (window.location.hash === "#register" || new URLSearchParams(window.location.search).get("mode") === "register") {
        switchToRegister();
    }

    if (registerRoleSelect && rollNumberLabel && rollNumberInput) {
        registerRoleSelect.addEventListener("change", () => {
            if (registerRoleSelect.value === "teacher") {
                rollNumberLabel.textContent = "Faculty ID / Designation";
                rollNumberInput.placeholder = "e.g. FAC-001 or Asst. Professor (optional)";
            } else {
                rollNumberLabel.textContent = "Roll Number / ID";
                rollNumberInput.placeholder = "e.g. 124CS0001 (optional for faculty)";
            }
        });
    }

    // ========================================
    // SIGN IN SUBMISSION
    // ========================================
    const loginForm = document.getElementById("loginForm");
    const loginSubmitBtn = document.getElementById("loginSubmit");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const client = getAuthClient();
            if (!client) {
                if (window.CampusCare) CampusCare.toast("Authentication service unavailable.", "error");
                return;
            }

            const email = emailInput?.value.trim();
            const password = passwordInput?.value;

            if (!email || !password) {
                if (loginMessage) {
                    loginMessage.textContent = "Please enter both email and password.";
                    loginMessage.className = "message text-red";
                }
                return;
            }

            // Save or clear remembered email
            try {
                if (rememberCheckbox?.checked) {
                    localStorage.setItem("campuscare_remembered_email", email);
                } else {
                    localStorage.removeItem("campuscare_remembered_email");
                }
            } catch (err) {}

            loginSubmitBtn.disabled = true;
            loginSubmitBtn.classList.add("is-loading");
            if (loginMessage) {
                loginMessage.textContent = "Signing in...";
                loginMessage.className = "message text-slate";
            }

            try {
                const { data, error } = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    throw error;
                }

                if (loginMessage) {
                    loginMessage.textContent = "Login successful! Redirecting...";
                    loginMessage.className = "message text-green font-bold";
                }

                if (window.CampusCare) CampusCare.toast("Signed in successfully!", "success");

                setTimeout(() => {
                    const role = data.user?.role || data.user?.user_metadata?.role;
                    if (role === 'admin' || role === 'teacher') {
                        window.location.href = "teacher-dashboard.html";
                    } else {
                        window.location.href = "dashboard.html";
                    }
                }, 600);

            } catch (err) {
                console.error("Login failed:", err);
                const msg = err.message || "Failed to sign in. Please check credentials.";
                if (loginMessage) {
                    loginMessage.textContent = msg;
                    loginMessage.className = "message text-red";
                }
                if (window.CampusCare) CampusCare.toast(msg, "error");
            } finally {
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.classList.remove("is-loading");
            }
        });
    }

    // ========================================
    // SIGN UP SUBMISSION
    // ========================================
    const registerForm = document.getElementById("registerForm");
    const registerSubmitBtn = document.getElementById("registerSubmit");
    const registerMessage = document.getElementById("registerMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const client = getAuthClient();
            if (!client) {
                if (window.CampusCare) CampusCare.toast("Authentication service initializing. Please retry in a moment.", "warning");
                if (registerMessage) {
                    registerMessage.textContent = "Authentication service initializing. Please retry in a moment.";
                    registerMessage.className = "message text-red";
                }
                return;
            }

            const name = document.getElementById("registerName")?.value.trim();
            const email = document.getElementById("registerEmail")?.value.trim();
            const rollNumber = document.getElementById("rollNumber")?.value.trim() || "";
            const role = registerRoleSelect?.value || "student";
            const password = registerPasswordInput?.value;

            if (!name || !email || !password) {
                if (registerMessage) {
                    registerMessage.textContent = "Please fill in your full name, email, and password.";
                    registerMessage.className = "message text-red";
                }
                if (window.CampusCare) CampusCare.toast("Full name, email, and password are required.", "warning");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (registerMessage) {
                    registerMessage.textContent = "Please enter a valid email address.";
                    registerMessage.className = "message text-red";
                }
                if (window.CampusCare) CampusCare.toast("Please enter a valid email address.", "warning");
                return;
            }

            if (password.length < 6) {
                if (registerMessage) {
                    registerMessage.textContent = "Password must be at least 6 characters long.";
                    registerMessage.className = "message text-red";
                }
                if (window.CampusCare) CampusCare.toast("Password must be at least 6 characters.", "warning");
                return;
            }

            registerSubmitBtn.disabled = true;
            registerSubmitBtn.classList.add("is-loading");
            if (registerMessage) {
                registerMessage.textContent = "Creating your account...";
                registerMessage.className = "message text-slate";
            }

            try {
                const assignedRoll = rollNumber || (role === 'teacher' ? 'FAC-' + Math.floor(1000 + Math.random() * 9000) : '124CS' + Math.floor(1000 + Math.random() * 9000));

                const { data, error } = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name,
                            roll_number: assignedRoll,
                            role: role
                        }
                    }
                });

                if (error) throw error;

                if (registerMessage) {
                    registerMessage.textContent = "Account created successfully! Redirecting to your dashboard...";
                    registerMessage.className = "message text-green font-bold";
                }

                if (window.CampusCare) {
                    CampusCare.toast("Account created! Redirecting...", "success", 3000);
                }

                registerForm.reset();
                if (passwordStrength) passwordStrength.dataset.level = "0";

                // Automatically redirect to the respective dashboard
                setTimeout(() => {
                    const userRole = data?.user?.role || data?.user?.user_metadata?.role || role;
                    if (userRole === 'teacher' || userRole === 'admin') {
                        window.location.href = "teacher-dashboard.html";
                    } else {
                        window.location.href = "dashboard.html";
                    }
                }, 800);

            } catch (err) {
                console.error("Sign up failed:", err);
                const msg = err.message || "Failed to create account.";
                if (registerMessage) {
                    registerMessage.textContent = msg;
                    registerMessage.className = "message text-red";
                }
                if (window.CampusCare) CampusCare.toast(msg, "error");
            } finally {
                registerSubmitBtn.disabled = false;
                registerSubmitBtn.classList.remove("is-loading");
            }
        });
    }

    // ========================================
    // FORGOT PASSWORD
    // ========================================
    const forgotPasswordBtn = document.getElementById("forgotPassword");
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const client = getAuthClient();
            if (!client) {
                if (window.CampusCare) CampusCare.toast("Authentication service unavailable.", "error");
                return;
            }

            const email = emailInput?.value.trim();

            if (!email) {
                if (window.CampusCare) {
                    CampusCare.toast("Please enter your email in the field above first.", "info");
                }
                emailInput?.focus();
                return;
            }

            try {
                const redirectUrl = window.location.origin + "/reset-password.html";
                const { error } = await client.auth.resetPasswordForEmail(email, {
                    redirectTo: redirectUrl
                });

                if (error) throw error;

                if (window.CampusCare) {
                    CampusCare.toast("Password reset instructions sent to your email.", "success", 5000);
                }
            } catch (err) {
                console.error("Password reset error:", err);
                if (window.CampusCare) {
                    CampusCare.toast(err.message || "Could not send reset instructions.", "error");
                }
            }
        });
    }

});
