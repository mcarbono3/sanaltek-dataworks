/**
 * Sanaltek Dataworks - Manejador de Formulario de Contacto
 * Funcionalidades:
 * - Validación avanzada de formulario
 * - Feedback visual para el usuario
 * - Simulación de envío de datos
 */

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.fields = {
            nombre: {
                element: document.getElementById('nombre'),
                errorMsg: 'Por favor ingrese su nombre completo',
                regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/
            },
            email: {
                element: document.getElementById('email'),
                errorMsg: 'Por favor ingrese un correo electrónico válido',
                regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            asunto: {
                element: document.getElementById('asunto'),
                errorMsg: 'Por favor ingrese un asunto',
                regex: /.{3,100}/
            },
            mensaje: {
                element: document.getElementById('mensaje'),
                errorMsg: 'Por favor ingrese un mensaje de al menos 10 caracteres',
                regex: /.{10,1000}/
            }
        };
        
        this.init();
    }
    
    init() {
        // Crear elementos para mensajes de error
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '5px';
            errorElement.style.display = 'none';
            field.element.parentNode.appendChild(errorElement);
            field.errorElement = errorElement;
            
            // Añadir evento para validación en tiempo real
            field.element.addEventListener('blur', () => {
                this.validateField(fieldName);
            });
            
            // Añadir evento para quitar mensaje de error al escribir
            field.element.addEventListener('input', () => {
                field.errorElement.style.display = 'none';
                field.element.style.borderColor = '#DDDDDD';
            });
        });
        
        // Añadir evento de envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.element.value.trim();
        
        if (!field.regex.test(value)) {
            field.errorElement.textContent = field.errorMsg;
            field.errorElement.style.display = 'block';
            field.element.style.borderColor = '#e74c3c';
            return false;
        } else {
            field.errorElement.style.display = 'none';
            field.element.style.borderColor = '#4CB963';
            return true;
        }
    }
    
    validateAllFields() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showSuccessMessage() {
        // Crear y mostrar mensaje de éxito
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <div style="background-color: #4CB963; color: white; padding: 16px; border-radius: 4px; text-align: center; margin-top: 20px;">
                <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <h3 style="margin-bottom: 10px;">¡Mensaje enviado con éxito!</h3>
                <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
            </div>
        `;
        
        // Reemplazar el formulario con el mensaje de éxito
        this.form.style.opacity = '0';
        setTimeout(() => {
            this.form.parentNode.replaceChild(successMsg, this.form);
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.transition = 'opacity 0.5s ease';
                successMsg.style.opacity = '1';
            }, 10);
        }, 300);
    }
    
    showLoadingState() {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    }
    
    resetLoadingState() {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = 'Enviar Mensaje';
    }
    
    handleSubmit() {
        if (!this.validateAllFields()) {
            return;
        }
        
        this.showLoadingState();
        
        // Simulación de envío de datos (en un caso real, aquí iría la llamada AJAX)
        setTimeout(() => {
            this.resetLoadingState();
            this.showSuccessMessage();
        }, 1500);
    }
}

// Inicializar el manejador de formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        const formHandler = new FormHandler('contactForm');
    }
});

