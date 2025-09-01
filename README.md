# 🎓 El Rincón del CET 1 - Portal Educativo

## 📋 Descripción
Portal web profesional para la institución educativa CET 1, diseñado con tecnologías modernas y un enfoque en la experiencia del usuario.

## ✨ Características Principales

### 🎨 Diseño Visual
- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Paleta de Colores**: Celeste, blanco, amarillo y azul en tonos suaves
- **Tipografía Moderna**: Fuente Inter de Google Fonts
- **Efectos Glassmorphism**: Barras laterales con efecto de cristal esmerilado
- **Gradientes Elegantes**: Transiciones suaves entre colores

### 🖼️ Fondos Profesionales
- **Imágenes de Unsplash**: Fondos de alta calidad relacionados con educación
- **Efectos de Parallax**: Movimiento sutil al hacer scroll
- **Blend Modes**: Combinación armoniosa de imágenes y colores
- **Fondo de Partículas**: Sistema de partículas animadas en JavaScript

### ⚡ Funcionalidades JavaScript
- **Animaciones de Entrada**: Elementos que aparecen con efectos suaves
- **Sistema de Autenticación**: Página de login completa y funcional
- **Reloj en Tiempo Real**: Hora actualizada cada segundo
- **Contador de Visitantes**: Seguimiento de visitas (localStorage)
- **Scroll Suave**: Navegación fluida entre secciones
- **Efectos Hover**: Interacciones visuales atractivas
- **Sistema de Notificaciones**: Alertas tipo toast
- **Protección de Navegación**: Requiere login para acceder a funcionalidades

### 📱 Navegación
- **Barra Lateral Izquierda**: 
  - Calendario para Guía
  - Mis Horarios
  - Proyectos a Realizar
- **Barra Lateral Derecha**: Información dinámica según la navegación
- **Header Sticky**: Navegación siempre visible
- **Menú Principal**: Enlaces a secciones importantes
- **Sección de Historia**: Timeline completo del CET Nº1 desde 1965

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno
- Conexión a internet (para cargar fuentes e imágenes)

### Pasos para ejecutar
1. Descargar todos los archivos en una carpeta
2. Abrir `index.html` en tu navegador
3. ¡Disfrutar de la experiencia!

### Estructura de archivos
```
📁 El Rincón del CET 1/
├── 📄 index.html          # Página principal
├── 📄 login.html          # Página de inicio de sesión
├── 📄 style.css           # Estilos principales
├── 📄 backgrounds.css     # Estilos de fondos e imágenes
├── 📄 login.css           # Estilos específicos del login
├── 📄 script.js           # Funcionalidades JavaScript principales
├── 📄 login.js            # Funcionalidades JavaScript del login
├── 📁 images/             # Carpeta para imágenes locales
└── 📄 README.md           # Este archivo
```

## 🎯 Funcionalidades Destacadas

### 🔐 Sistema de Autenticación
- **Página de Login Completa**: Diseño profesional y funcional
- **Validación en Tiempo Real**: Verificación de campos mientras se escribe
- **Funcionalidad "Recordarme"**: Guarda credenciales en localStorage
- **Login con Redes Sociales**: Botones para Google y Facebook
- **Recuperación de Contraseña**: Enlace funcional
- **Enlace de Registro**: Para nuevos usuarios

### 🚫 Protección de Navegación
- **Acceso Restringido**: Las opciones de navegación requieren login
- **Overlay Visual**: Indicadores claros de que se necesita autenticación
- **Modal de Restricción**: Mensaje elegante de "Acceso Restringido"
- **Redirección Automática**: Va directamente a la página de login

### ⏰ Elementos Interactivos
- **Reloj en tiempo real**: Actualizado cada segundo
- **Contador de visitantes**: Persistente en localStorage
- **Animaciones de carga progresiva**: Efectos suaves de entrada
- **Partículas de fondo**: Sistema animado en la página de login
- **Timeline de historia**: Cronología interactiva del CET Nº1
- **Estadísticas dinámicas**: Números que se animan al hacer scroll

### 🎭 Efectos Visuales
- **Fondo de partículas animadas**: En la página de login
- **Efectos de hover en tarjetas**: Interacciones atractivas
- **Transiciones suaves**: Entre estados y elementos
- **Efectos de brillo**: En botones y elementos interactivos
- **Animaciones CSS**: Keyframes personalizados
- **Timeline visual**: Línea de tiempo con círculos y conexiones
- **Contadores animados**: Números que se incrementan visualmente

### 📱 Responsive Design
- **Adaptable a móviles**: Optimizado para dispositivos táctiles
- **Navegación optimizada**: Para cada tipo de dispositivo
- **Imágenes responsivas**: Se ajustan automáticamente
- **Layout flexible**: Grid y flexbox modernos

## 🌐 Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos avanzados con flexbox y grid
- **JavaScript ES6+**: Funcionalidades interactivas
- **Google Fonts**: Tipografía profesional
- **Unsplash**: Imágenes de alta calidad
- **CSS Grid & Flexbox**: Layouts modernos
- **CSS Animations**: Transiciones y keyframes
- **localStorage**: Persistencia de datos del usuario

## 🎨 Personalización

### Cambiar Colores
Los colores principales se pueden modificar en `style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f39c12;
    --text-color: #2c3e50;
}
```

### Cambiar Imágenes
Las imágenes de fondo se pueden modificar en `backgrounds.css`:
```css
body {
    background-image: url('tu-imagen.jpg');
}
```

### Personalizar Login
Los estilos del login se pueden modificar en `login.css`:
```css
.login-container {
    background: tu-color-personalizado;
}
```

### Agregar Funcionalidades
Los archivos JavaScript están estructurados modularmente:
- `script.js`: Funcionalidades principales de la página
- `login.js`: Funcionalidades específicas del login

## 🔐 Flujo de Autenticación

1. **Usuario no autenticado**: Ve overlay de "requiere login" en opciones
2. **Clic en opción**: Aparece modal de "Acceso Restringido"
3. **Botón "Iniciar Sesión"**: Redirige a `login.html`
4. **Formulario de login**: Validación en tiempo real
5. **Autenticación exitosa**: Redirige de vuelta a `index.html`
6. **Usuario autenticado**: Acceso completo a todas las funcionalidades

## 📞 Soporte

Para dudas o sugerencias sobre el portal:
- 📧 Email: info@cet1.edu.mx
- 📱 Teléfono: (555) 123-4567

## 📄 Licencia

© 2024 El Rincón del CET 1. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la comunidad educativa del CET 1**
