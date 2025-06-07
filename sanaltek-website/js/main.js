/**
 * Sanaltek Dataworks - JavaScript Principal
 * Funcionalidades:
 * - Menú móvil
 * - Navegación suave
 * - Cambio de estilo del header al hacer scroll
 * - Animaciones de elementos al hacer scroll
 * - Validación del formulario de contacto
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    
    // Función para manejar el menú móvil
    function toggleMenu() {
        navMenu.classList.toggle('active');
    }
    
    // Función para cerrar el menú al hacer clic en un enlace
    function closeMenu() {
        navMenu.classList.remove('active');
    }
    
    // Función para cambiar el estilo del header al hacer scroll
    function handleScroll() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Función para activar el enlace de navegación según la sección visible
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
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
    
    // Función para animar elementos al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .project-card, .team-member');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Función para validar el formulario de contacto
    function validateForm(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }
        
        // Simulación de envío exitoso
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
    }
    
    // Inicializar animaciones de elementos
    function initAnimations() {
        const elements = document.querySelectorAll('.service-card, .project-card, .team-member');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // Ejecutar animaciones iniciales
        setTimeout(animateOnScroll, 300);
    }
    
    // Event Listeners
    menuToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('scroll', animateOnScroll);
    
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
    
    // Inicializar funciones
    handleScroll();
    setActiveNavLink();
    initAnimations();
});

