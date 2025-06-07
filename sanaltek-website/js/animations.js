/**
 * Sanaltek Dataworks - Animaciones JavaScript
 * Funcionalidades:
 * - Animaciones basadas en scroll
 * - Efectos de parallax
 * - Animaciones de entrada para elementos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos
    const sections = document.querySelectorAll('section');
    const contactForm = document.querySelector('.contact-form');
    const heroSection = document.querySelector('.hero');
    
    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Función para manejar la intersección de elementos
    function handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir clases de animación según el tipo de elemento
                if (entry.target.classList.contains('service-card')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('team-member')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target === contactForm) {
                    contactForm.classList.add('visible');
                } else if (entry.target.classList.contains('about-image')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('about-text')) {
                    entry.target.classList.add('slide-in-right');
                }
                
                // Dejar de observar el elemento una vez animado
                observer.unobserve(entry.target);
            }
        });
    }
    
    // Crear el Intersection Observer
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.service-card, .project-card, .team-member, .about-image, .about-text').forEach(el => {
        observer.observe(el);
    });
    
    if (contactForm) {
        observer.observe(contactForm);
    }
    
    // Efecto parallax para la sección hero
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                const translateY = scrollPosition * 0.4;
                heroSection.style.backgroundPosition = `center ${translateY}px`;
            }
        });
    }
    
    // Animación de contador para estadísticas (se puede añadir una sección de estadísticas)
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Iniciar animaciones de contador cuando estén visibles
    document.querySelectorAll('[data-target]').forEach(counter => {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            },
            { threshold: 0.5 }
        );
        
        counterObserver.observe(counter);
    });
    
    // Animación de typing para títulos (opcional)
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Ejemplo de uso para un elemento específico (se puede personalizar)
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const originalText = typingElement.textContent;
        const typingObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    typeWriter(typingElement, originalText);
                    typingObserver.unobserve(typingElement);
                }
            },
            { threshold: 0.5 }
        );
        
        typingObserver.observe(typingElement);
    }
});

