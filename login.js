// Script específico para la página de login de El Rincón del CET 1

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades del login
    initLoginForm();
    initParticles();
    initFormValidation();
    initSocialButtons();
    initRememberMe();
});

// Inicializar formulario de login
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.querySelector('.login-submit');
    
    if (loginForm && submitBtn) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Manejar el proceso de login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validar campos
    if (!validateForm(email, password)) {
        return;
    }
    
    // Cambiar estado del botón
    const submitBtn = document.querySelector('.login-submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simular proceso de autenticación y validar contra usuarios registrados en localStorage
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            showSuccessMessage('Credenciales inválidas');
            return;
        }

        submitBtn.textContent = '¡Bienvenido!';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');

        if (remember) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', email);
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        }));

        showSuccessMessage('¡Inicio de sesión exitoso!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    }, 1200);
}

// Validar formulario
function validateForm(email, password) {
    let isValid = true;
    
    // Limpiar errores previos
    clearFormErrors();
    
    // Validar email
    if (!email || !isValidEmail(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    // Validar contraseña
    if (!password || password.length < 6) {
        showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar error en campo específico
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.style.fontWeight = '500';
        
        // Insertar después del campo
        field.parentNode.appendChild(errorDiv);
        
        // Agregar clase de error al campo
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    }
}

// Limpiar errores del formulario
function clearFormErrors() {
    // Remover mensajes de error
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    
    // Restaurar estilos de campos
    document.querySelectorAll('.form-group input').forEach(input => {
        input.style.borderColor = '#e8f4fd';
        input.style.boxShadow = 'none';
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
        z-index: 10001;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Inicializar partículas de fondo
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'login-particles';
    
    // Crear partículas
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Delay aleatorio para animación
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Inicializar validación en tiempo real
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError('email', 'Por favor ingresa un email válido');
            } else {
                clearFieldError('email');
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.value && isValidEmail(this.value)) {
                clearFieldError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 6) {
                showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            } else {
                clearFieldError('password');
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (this.value && this.value.length >= 6) {
                clearFieldError('password');
            }
        });
    }
}

// Limpiar error de campo específico
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.style.borderColor = '#e8f4fd';
        field.style.boxShadow = 'none';
    }
}

// Inicializar botones de redes sociales
function initSocialButtons() {
    const googleBtn = document.querySelector('.social-btn:first-child');
    const facebookBtn = document.querySelector('.social-btn:last-child');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('Google');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('Facebook');
        });
    }
}

// Manejar login con redes sociales
function handleSocialLogin(provider) {
    console.log(`Iniciando sesión con ${provider}...`);
    
    // Aquí iría la integración real con las APIs de Google/Facebook
    showSuccessMessage(`Redirigiendo a ${provider}...`);
    
    // Simular redirección
    setTimeout(() => {
        showSuccessMessage('Funcionalidad en desarrollo');
    }, 1000);
}

// Inicializar funcionalidad "Recordarme"
function initRememberMe() {
    const rememberCheckbox = document.getElementById('remember');
    const emailInput = document.getElementById('email');
    
    if (rememberCheckbox && emailInput) {
        // Cargar datos guardados
        const rememberMe = localStorage.getItem('rememberMe');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (rememberMe === 'true' && savedEmail) {
            rememberCheckbox.checked = true;
            emailInput.value = savedEmail;
        }
        
        // Guardar cambios
        rememberCheckbox.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userEmail');
            }
        });
        
        // Guardar email cuando se escribe
        emailInput.addEventListener('blur', function() {
            if (rememberCheckbox.checked && this.value) {
                localStorage.setItem('userEmail', this.value);
            }
        });
    }
}

// Función para recuperar contraseña
function handleForgotPassword() {
    const email = document.getElementById('email').value;
    
    if (!email || !isValidEmail(email)) {
        showSuccessMessage('Por favor ingresa un email válido primero');
        return;
    }
    
    showSuccessMessage('Enviando instrucciones de recuperación...');
    
    // Aquí iría la lógica real de recuperación de contraseña
    setTimeout(() => {
        showSuccessMessage('Instrucciones enviadas a tu email');
    }, 2000);
}

// Función para registro
function handleRegister() {
    showSuccessMessage('Redirigiendo a la página de registro...');
    
    // Aquí iría la redirección a la página de registro
    setTimeout(() => {
        showSuccessMessage('Funcionalidad en desarrollo');
    }, 1000);
}

// Agregar event listeners para enlaces adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Enlace de "¿Olvidaste tu contraseña?"
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Enlace de registro: dejar navegar a register.html sin interceptar
});

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .field-error {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

document.head.appendChild(style);
