// Registro simple usando localStorage
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        // Validaciones básicas
        if (!name) return showFieldError('name', 'Ingresa tu nombre');
        if (!isValidEmail(email)) return showFieldError('email', 'Email inválido');
        if (password.length < 6) return showFieldError('password', 'Mínimo 6 caracteres');
        if (password !== confirm) return showFieldError('confirm', 'Las contraseñas no coinciden');

        // Recuperar usuarios guardados
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return showToast('Ese correo ya está registrado', 'error');
        }

        // Guardar usuario (nota: en producción se debe hashear y usar backend)
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        showToast('Cuenta creada. Redirigiendo a login...', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
});

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const old = field.parentNode.querySelector('.field-error');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'field-error';
    div.textContent = message;
    div.style.color = '#e74c3c';
    div.style.fontSize = '0.8rem';
    div.style.marginTop = '0.25rem';
    div.style.fontWeight = '500';
    field.parentNode.appendChild(div);
    field.style.borderColor = '#e74c3c';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#2c3e50'};
        color: white; padding: .75rem 1rem; border-radius: 8px; z-index: 10001;
        box-shadow: 0 8px 25px rgba(0,0,0,.2); font-weight: 600;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}


