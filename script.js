// Script principal para El Rincón del CET 1
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todas las funcionalidades
    initAnimations();
    initParallaxEffects();
    initInteractiveElements();
    initSmoothScrolling();
    initLoadingEffects();
    initParticleBackground();
    initClock();
    initVisitorCount();
    initDynamicSidebar();
    initNavigationProtection();
    initHistoryAnimations(); // Nueva función para historia
    initStatsCounter(); // Nueva función para contador de estadísticas
    initHistoryMissionVisionToggles(); // Toggle de Historia/Misión/Visión
    initScheduleUpload(); // Subida de archivo para Mis Horarios
});

// Animaciones de entrada para elementos
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.content-card, .nav-option, .info-card').forEach(el => {
        observer.observe(el);
    });
}

// Efectos de parallax para el fondo
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Subida de archivo para "Mis Horarios" y guardado en la cuenta (localStorage)
function initScheduleUpload() {
    const link = document.getElementById('mis-horarios-link');
    if (!link) return;

    // Crear input de archivo oculto
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    link.addEventListener('click', function(e) {
        e.preventDefault();
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            showLoginRequiredModal();
            return;
        }
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const key = userData.email ? `scheduleFile:${userData.email}` : null;
        if (key) {
            const saved = localStorage.getItem(key);
            if (saved) {
                // Ya hay archivo guardado: mostrar modal centrado con el archivo
                try {
                    const payload = JSON.parse(saved);
                    openScheduleModal(payload);
                    return;
                } catch {}
            }
        }
        // Si no hay guardado, abrir selector
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024 * 2) { // 2MB
            showNotification('El archivo supera 2MB. Sube uno más liviano.', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = function() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                if (!userData.email) {
                    showNotification('No se encontró la cuenta activa.', 'error');
                    return;
                }
                const key = `scheduleFile:${userData.email}`;
                const payload = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: reader.result,
                    uploadedAt: new Date().toISOString()
                };
                localStorage.setItem(key, JSON.stringify(payload));
                showNotification('Horario subido y guardado en tu cuenta.', 'success');
                // Abrir vista previa inmediatamente
                openScheduleModal(payload);
            } catch (err) {
                showNotification('No se pudo guardar el archivo.', 'error');
            }
        };
        reader.readAsDataURL(file);
    });
}

function openScheduleModal(payload) {
    const modal = document.createElement('div');
    modal.className = 'login-required-modal show';
    const content = document.createElement('div');
    content.className = 'modal-content';
    const title = document.createElement('div');
    title.className = 'login-required-header';
    title.innerHTML = `<h2>Mi Horario</h2><p>${payload.name} · ${(payload.size/1024).toFixed(0)} KB</p>`;

    const view = document.createElement('div');
    let inner = '';
    if (payload.type && payload.type.startsWith('image/')) {
        inner = `<img id="schedule-preview-img" src="${payload.dataUrl}" alt="Horario" style="max-width:100%; max-height:60vh; border-radius:12px; border:1px solid #e8f4fd; cursor: zoom-in;">`;
    } else if (payload.type === 'application/pdf' || /\.pdf$/i.test(payload.name)) {
        inner = `<embed src="${payload.dataUrl}" type="application/pdf" style="width:100%; height:60vh; border-radius:12px; border:1px solid #e8f4fd;" />`;
    } else {
        inner = `<p style="color:#6c757d;">Formato no previsualizable. Puedes descargar tu archivo.</p>`;
    }
    view.innerHTML = inner;

    // Click para ampliar imagen en pantalla completa
    if (payload.type && payload.type.startsWith('image/')) {
        setTimeout(() => {
            const img = document.getElementById('schedule-preview-img');
            if (img) {
                img.addEventListener('click', () => openImageFullscreen(payload.dataUrl, payload.name));
            }
        }, 0);
    }

    const actions = document.createElement('div');
    actions.className = 'login-required-actions';
    actions.style.marginTop = '1rem';
    const download = document.createElement('a');
    download.className = 'btn-primary';
    download.href = payload.dataUrl;
    download.download = payload.name || 'horario';
    download.textContent = 'Descargar';
    const close = document.createElement('button');
    close.className = 'btn-secondary';
    close.textContent = 'Cerrar';
    close.addEventListener('click', () => closeLoginRequiredModal());

    // Reemplazar archivo
    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'btn-secondary';
    replaceBtn.textContent = 'Reemplazar archivo';
    replaceBtn.style.marginRight = '0.5rem';
    const replaceInput = document.createElement('input');
    replaceInput.type = 'file';
    replaceInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls';
    replaceInput.style.display = 'none';
    document.body.appendChild(replaceInput);

    replaceBtn.addEventListener('click', () => replaceInput.click());
    replaceInput.addEventListener('change', () => {
        const file = replaceInput.files && replaceInput.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024 * 2) {
            showNotification('El archivo supera 2MB. Sube uno más liviano.', 'warning');
            return;
        }
        const reader = new FileReader();
        reader.onload = function() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                if (!userData.email) {
                    showNotification('No se encontró la cuenta activa.', 'error');
                    return;
                }
                const key = `scheduleFile:${userData.email}`;
                const newPayload = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: reader.result,
                    uploadedAt: new Date().toISOString()
                };
                localStorage.setItem(key, JSON.stringify(newPayload));
                // Actualizar cabecera
                title.innerHTML = `<h2>Mi Horario</h2><p>${newPayload.name} · ${(newPayload.size/1024).toFixed(0)} KB</p>`;
                // Actualizar vista
                if (newPayload.type && newPayload.type.startsWith('image/')) {
                    view.innerHTML = `<img src="${newPayload.dataUrl}" alt="Horario" style="max-width:100%; max-height:60vh; border-radius:12px; border:1px solid #e8f4fd;">`;
                } else if (newPayload.type === 'application/pdf' || /\.pdf$/i.test(newPayload.name)) {
                    view.innerHTML = `<embed src="${newPayload.dataUrl}" type="application/pdf" style="width:100%; height:60vh; border-radius:12px; border:1px solid #e8f4fd;" />`;
                } else {
                    view.innerHTML = `<p style=\"color:#6c757d;\">Formato no previsualizable. Puedes descargar tu archivo.</p>`;
                }
                // Actualizar descarga
                download.href = newPayload.dataUrl;
                download.download = newPayload.name || 'horario';
                showNotification('Horario reemplazado correctamente.', 'success');
            } catch (err) {
                showNotification('No se pudo reemplazar el archivo.', 'error');
            }
        };
        reader.readAsDataURL(file);
    });

    actions.appendChild(replaceBtn);
    actions.appendChild(download);
    actions.appendChild(close);

    content.appendChild(title);
    content.appendChild(view);
    content.appendChild(actions);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

function openImageFullscreen(src, name) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,.85); display:flex; align-items:center; justify-content:center; z-index:10001;`;
    const img = document.createElement('img');
    img.src = src;
    img.alt = name || 'Horario';
    img.style.cssText = `max-width:95vw; max-height:95vh; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.5); cursor: zoom-out;`;
    overlay.appendChild(img);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
}

// Funcionalidades: desplegar/plegar Historia, Misión y Visión
function initHistoryMissionVisionToggles() {
    // Historia: colapsar/expandir items del timeline al hacer clic en el año
    document.querySelectorAll('.timeline-item').forEach(item => {
        const year = item.querySelector('.timeline-year');
        const content = item.querySelector('.timeline-content');
        if (year && content) {
            year.style.cursor = 'pointer';
            year.addEventListener('click', () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
            });
        }
    });

    // Misión y Visión: toggles por encabezado
    const missionHeader = document.getElementById('mision');
    const visionHeader = document.getElementById('vision');
    if (missionHeader) {
        const missionPara = missionHeader.nextElementSibling;
        missionHeader.style.cursor = 'pointer';
        missionHeader.addEventListener('click', () => {
            const isHidden = missionPara && missionPara.style.display === 'none';
            if (missionPara) missionPara.style.display = isHidden ? '' : 'none';
        });
    }
    if (visionHeader) {
        const visionPara = visionHeader.nextElementSibling;
        visionHeader.style.cursor = 'pointer';
        visionHeader.addEventListener('click', () => {
            const isHidden = visionPara && visionPara.style.display === 'none';
            if (visionPara) visionPara.style.display = isHidden ? '' : 'none';
        });
    }
}

// Protección de navegación - requiere login
function initNavigationProtection() {
    // Verificar si el usuario está logueado (simulado con localStorage)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Agregar indicadores visuales de que se requiere login
        document.querySelectorAll('.nav-option').forEach(option => {
            option.style.opacity = '0.7';
            option.style.cursor = 'pointer';
            
            // Agregar overlay de "Requiere Login"
            const overlay = document.createElement('div');
            overlay.className = 'login-required-overlay';
            overlay.innerHTML = `
                <div class="overlay-content">
                    <span class="lock-icon">🔒</span>
                    <span class="overlay-text">Inicia sesión para acceder</span>
                </div>
            `;
            option.appendChild(overlay);
            
            // Agregar evento de clic
            option.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginRequiredModal();
            });
        });
    }
}

// Mostrar modal de "requiere login"
function showLoginRequiredModal() {
    const modal = document.createElement('div');
    modal.className = 'login-required-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="login-required-header">
                <span class="lock-icon-large">🔒</span>
                <h2>Acceso Restringido</h2>
                <p>Necesitas iniciar sesión para acceder a esta funcionalidad</p>
            </div>
            <div class="login-required-actions">
                <button class="btn-primary" onclick="goToLogin()">Iniciar Sesión</button>
                <button class="btn-secondary" onclick="closeLoginRequiredModal()">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Función para ir al login
function goToLogin() {
    window.location.href = 'login.html';
}

// Función para cerrar modal
function closeLoginRequiredModal() {
    const modal = document.querySelector('.login-required-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Elementos interactivos
function initInteractiveElements() {
    // Efectos hover en las tarjetas
    document.querySelectorAll('.content-card, .nav-option').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Permitir navegación real si el link tiene href a una página
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
            }
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar contenido de la barra lateral derecha
            updateRightSidebar(this.textContent.trim());
        });
    });

    // Botón de login con efecto
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Redirigir a la página de login
                window.location.href = 'login.html';
            }, 150);
        });
    }
}

// Inicializar barra lateral derecha dinámica
function initDynamicSidebar() {
    // Contenido inicial para "Inicio"
    updateRightSidebar('Inicio');
}

// Actualizar contenido de la barra lateral derecha según la navegación
function updateRightSidebar(section) {
    const rightSidebar = document.querySelector('.right-sidebar');
    if (!rightSidebar) return;

    let content = '';
    
    switch(section) {
        case 'Inicio':
            content = `
                <div class="sidebar-header">
                    <h3>Información Rápida</h3>
                    <div class="visitor-count">👥 <span>0</span> visitantes</div>
                </div>
                <div class="info-section">
                    <div class="info-card">
                        <h4>📢 Anuncios</h4>
                        <p>Mantente informado sobre eventos importantes y noticias del campus.</p>
                    </div>
                    <div class="info-card">
                        <h4>🔗 Enlaces Útiles</h4>
                        <ul class="quick-links">
                            <li><a href="#">Biblioteca Virtual</a></li>
                            <li><a href="#">Calendario Escolar</a></li>
                            <li><a href="#">Soporte Técnico</a></li>
                        </ul>
                    </div>
                </div>
            `;
            break;
            
        case 'Acerca de':
            content = `
                <div class="sidebar-header">
                    <h3>Información Institucional</h3>
                </div>
                <div class="info-section">
                    <div class="info-card">
                        <h4>🏫 Historia</h4>
                        <p>Conoce la trayectoria y valores de nuestra institución educativa.</p>
                    </div>
                    <div class="info-card">
                        <h4>🎯 Misión</h4>
                        <p>Formar profesionales competentes y ciudadanos responsables.</p>
                    </div>
                    <div class="info-card">
                        <h4>🌟 Visión</h4>
                        <p>Ser líderes en la educación técnica y tecnológica.</p>
                    </div>
                </div>
            `;
            break;
            
        case 'Contacto':
            content = `
                <div class="sidebar-header">
                    <h3>Información de Contacto</h3>
                </div>
                <div class="info-section">
                    <div class="info-card">
                        <h4>📧 Email</h4>
                        <p>info@cet1.edu.mx</p>
                        <p>admissions@cet1.edu.mx</p>
                    </div>
                    <div class="info-card">
                        <h4>📞 Teléfonos</h4>
                        <p>Admisiones: (555) 123-4567</p>
                        <p>Soporte: (555) 123-4568</p>
                    </div>
                    <div class="info-card">
                        <h4>📍 Dirección</h4>
                        <p>Av. Educación 123, Col. Centro</p>
                        <p>Ciudad de México, CDMX</p>
                    </div>
                </div>
            `;
            break;
            
        default:
            content = `
                <div class="sidebar-header">
                    <h3>Información Rápida</h3>
                    <div class="visitor-count">👥 <span>0</span> visitantes</div>
                </div>
                <div class="info-section">
                    <div class="info-card">
                        <h4>📢 Anuncios</h4>
                        <p>Mantente informado sobre eventos importantes y noticias del campus.</p>
                    </div>
                    <div class="info-card">
                        <h4>🔗 Enlaces Útiles</h4>
                        <ul class="quick-links">
                            <li><a href="#">Biblioteca Virtual</a></li>
                            <li><a href="#">Calendario Escolar</a></li>
                            <li><a href="#">Soporte Técnico</a></li>
                        </ul>
                    </div>
                </div>
            `;
    }
    
    // Transición de salida
    rightSidebar.classList.add('updating');
    setTimeout(() => {
        rightSidebar.innerHTML = content;
        // Transición de entrada
        requestAnimationFrame(() => {
            rightSidebar.classList.remove('updating');
        });
    }, 150);
    
    // Reinicializar contador de visitantes si está en la sección de inicio
    if (section === 'Inicio') {
        initVisitorCount();
    }
}

// Scroll suave para enlaces internos
function initSmoothScrolling() {
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
}

// Efectos de carga
function initLoadingEffects() {
    // Simular carga de contenido
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.remove('loading');
            element.classList.add('loaded');
        }, (index + 1) * 300 + 500);
    });
}

// Fondo de partículas
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', resizeCanvas);
}

// Inicializar reloj
function initClock() {
    const clockElement = document.querySelector('.time');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            clockElement.textContent = timeString;
        }
        
        // Actualizar inmediatamente y luego cada segundo
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// Inicializar contador de visitantes
function initVisitorCount() {
    const visitorElement = document.querySelector('.visitor-count span');
    if (visitorElement) {
        let count = parseInt(localStorage.getItem('visitorCount') || '0');
        count++;
        localStorage.setItem('visitorCount', count.toString());
        visitorElement.textContent = count.toLocaleString();
    }
}

// Modal de login (mantenido para compatibilidad)
function showLoginModal() {
    // Redirigir a la página de login
    window.location.href = 'login.html';
}

// Efectos de escritura para el título
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Inicializar efectos de escritura
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.querySelector('.content-header h2');
    if (titleElement) {
        const originalText = titleElement.textContent;
        typeWriter(titleElement, originalText, 50);
    }
});

// Notificaciones toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Exportar funciones para uso global
window.ElRinconCET1 = {
    showNotification,
    showLoginModal,
    goToLogin,
    closeLoginRequiredModal
};

// Inicializar animaciones de la sección de historia
function initHistoryAnimations() {
    const historySection = document.querySelector('.history-section');
    if (!historySection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activar animaciones cuando la sección sea visible
                const timelineItems = entry.target.querySelectorAll('.timeline-item');
                const statCards = entry.target.querySelectorAll('.stat-card');
                const missionSection = entry.target.querySelector('.history-mission');

                // Animar timeline items
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = `slideInLeft 0.6s ease forwards`;
                    }, index * 100);
                });

                // Animar stat cards
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, 800 + (index * 100));
                });

                // Animar misión y visión
                if (missionSection) {
                    setTimeout(() => {
                        missionSection.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, 1200);
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(historySection);
}

// Función para contar números en las estadísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalNumber = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');
        
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentNumber) + suffix;
        }, 30);
    });
}

// Función para activar contador de estadísticas cuando sean visibles
function initStatsCounter() {
    const statsSection = document.querySelector('.history-stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(statsSection);
}
