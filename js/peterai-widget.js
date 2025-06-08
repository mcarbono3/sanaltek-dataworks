/**
 * PeterAI Widget - JavaScript Principal
 * Sistema de chat con IA integrado para Sanaltek Dataworks
 */

class PeterAIWidget {
    constructor() {
        this.apiBaseUrl = 'https://majestic-cascaron-b5db5a.netlify.app/.netlify/functions'; // Cambiar por la URL real
        this.token = localStorage.getItem('peterai_token');
        this.isOpen = false;
        this.isMinimized = false;
        this.isAuthenticated = false;
        
        this.initializeElements();
        this.bindEvents();
        this.checkAuthentication();
    }

    initializeElements() {
        this.trigger = document.getElementById('peteraiTrigger');
        this.widget = document.getElementById('peteraiWidget');
        this.authArea = document.getElementById('peteraiAuth');
        this.chatArea = document.getElementById('peteraiChat');
        this.messages = document.getElementById('peteraiMessages');
        this.typing = document.getElementById('peteraiTyping');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.authError = document.getElementById('authError');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.closeBtn = document.getElementById('closeBtn');
    }

    bindEvents() {
        // Eventos del trigger y controles
        this.trigger.addEventListener('click', () => this.toggleWidget());
        this.closeBtn.addEventListener('click', () => this.closeWidget());
        this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());

        // Eventos de autenticación
        this.loginBtn.addEventListener('click', () => this.login());
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.passwordInput.focus();
        });
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Eventos de chat
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize del textarea
        this.chatInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    async checkAuthentication() {
        if (this.token) {
            try {
                // Verificar si el token es válido haciendo una petición de prueba
                const response = await fetch(`${this.apiBaseUrl}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify({ message: 'test' })
                });

                if (response.ok) {
                    this.isAuthenticated = true;
                    this.showChatArea();
                } else {
                    this.clearToken();
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                this.clearToken();
            }
        }
    }

    async login() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!username || !password) {
            this.showError('Por favor, ingresa usuario y contraseña');
            return;
        }

        this.loginBtn.disabled = true;
        this.loginBtn.textContent = 'Iniciando sesión...';
        this.hideError();

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.token = data.token;
                localStorage.setItem('peterai_token', this.token);
                this.isAuthenticated = true;
                this.showChatArea();
                this.addMessage('system', `¡Bienvenido, ${data.user.username}!`);
            } else {
                this.showError(data.error || 'Error de autenticación');
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            this.loginBtn.disabled = false;
            this.loginBtn.textContent = 'Iniciar Sesión';
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || !this.isAuthenticated) return;

        // Añadir mensaje del usuario
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.autoResizeTextarea();

        // Mostrar indicador de escritura
        this.showTyping();
        this.sendBtn.disabled = true;

        try {
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ 
                    message,
                    context: this.getRecentContext()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.addMessage('ai', data.response);
                
                // Si es un reporte, mostrar opciones de descarga
                if (data.queryType === 'report') {
                    this.showReportOptions(data.response);
                }
            } else {
                if (response.status === 401) {
                    this.clearToken();
                    this.showAuthArea();
                    this.addMessage('system', 'Sesión expirada. Por favor, inicia sesión nuevamente.');
                } else {
                    this.addMessage('ai', 'Lo siento, hubo un error procesando tu solicitud.');
                }
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.addMessage('ai', 'Error de conexión. Por favor, inténtalo de nuevo.');
        } finally {
            this.hideTyping();
            this.sendBtn.disabled = false;
        }
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `peterai-message ${type}`;
        messageDiv.textContent = content;
        
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showReportOptions(content) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'peterai-message ai';
        optionsDiv.innerHTML = `
            <div style="margin-top: 10px;">
                <p>¿Te gustaría descargar este reporte en algún formato?</p>
                <div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
                    <button onclick="peteraiWidget.downloadReport('csv')" style="padding: 5px 10px; background: white; color: #2c5f5f; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">CSV</button>
                    <button onclick="peteraiWidget.downloadReport('txt')" style="padding: 5px 10px; background: white; color: #2c5f5f; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">TXT</button>
                    <button onclick="peteraiWidget.downloadReport('html')" style="padding: 5px 10px; background: white; color: #2c5f5f; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">HTML</button>
                    <button onclick="peteraiWidget.downloadReport('pdf')" style="padding: 5px 10px; background: white; color: #2c5f5f; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">PDF</button>
                </div>
            </div>
        `;
        
        this.messages.appendChild(optionsDiv);
        this.scrollToBottom();
    }

    async downloadReport(format) {
        // Esta función se implementaría para generar y descargar reportes
        // Por ahora, mostrar un mensaje
        this.addMessage('system', `Generando reporte en formato ${format.toUpperCase()}...`);
        
        // Aquí iría la lógica para llamar a la API de reportes
        // y descargar el archivo generado
    }

    getRecentContext() {
        // Obtener los últimos 5 mensajes para contexto
        const messageElements = this.messages.querySelectorAll('.peterai-message:not(.system)');
        const recentMessages = Array.from(messageElements).slice(-5);
        
        return recentMessages.map(msg => {
            const type = msg.classList.contains('user') ? 'user' : 'ai';
            return `${type}: ${msg.textContent}`;
        }).join('\n');
    }

    showTyping() {
        this.typing.classList.add('active');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typing.classList.remove('active');
    }

    showError(message) {
        this.authError.textContent = message;
        this.authError.style.display = 'block';
    }

    hideError() {
        this.authError.style.display = 'none';
    }

    showChatArea() {
        this.authArea.style.display = 'none';
        this.chatArea.classList.add('active');
    }

    showAuthArea() {
        this.chatArea.classList.remove('active');
        this.authArea.style.display = 'flex';
        this.isAuthenticated = false;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('peterai_token');
        this.isAuthenticated = false;
    }

    toggleWidget() {
        if (this.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        this.widget.classList.add('open');
        this.trigger.classList.add('hidden');
        this.isOpen = true;
        
        // Focus en el input apropiado
        setTimeout(() => {
            if (this.isAuthenticated) {
                this.chatInput.focus();
            } else {
                this.usernameInput.focus();
            }
        }, 300);
    }

    closeWidget() {
        this.widget.classList.remove('open');
        this.widget.classList.remove('minimized');
        this.trigger.classList.remove('hidden');
        this.isOpen = false;
        this.isMinimized = false;
    }

    toggleMinimize() {
        if (this.isMinimized) {
            this.widget.classList.remove('minimized');
            this.isMinimized = false;
        } else {
            this.widget.classList.add('minimized');
            this.isMinimized = true;
        }
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }
}

// Inicializar el widget cuando se carga la página
let peteraiWidget;

document.addEventListener('DOMContentLoaded', () => {
    peteraiWidget = new PeterAIWidget();
});

// Función global para descargar reportes (llamada desde los botones)
window.peteraiWidget = peteraiWidget;

