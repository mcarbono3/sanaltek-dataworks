/**
 * Script de integración para PeterAI Widget - Versión Corregida
 * Este archivo debe ser incluido en la página web de Sanaltek Dataworks
 */

(function() {
    'use strict';

    // Configuración del widget
    const PETERAI_CONFIG = {
        // URL del backend serverless (cambiar por la URL real de producción)
        apiBaseUrl: 'https://majestic-cascaron-b5db5a.netlify.app/.netlify/functions',
        
        // Configuración visual
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'sanaltek', // sanaltek, dark, light
        
        // Configuración de comportamiento
        autoOpen: false,
        showWelcomeMessage: true,
        persistSession: true
    };

    // Función para cargar CSS dinámicamente
    function loadCSS() {
        const css = `
            /* Estilos del widget PeterAI integrado */
            .peterai-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 400px;
                height: 600px;
                background: linear-gradient(135deg, #2c5f5f 0%, #4a8080 100%);
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(44, 95, 95, 0.3);
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
                transform: translateY(100%);
                opacity: 0;
            }

            .peterai-widget.open {
                transform: translateY(0);
                opacity: 1;
            }

            .peterai-widget.minimized {
                height: 80px;
                width: 300px;
            }

            .peterai-trigger {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                transition: all 0.3s ease;
            }

            .peterai-trigger:hover {
                transform: scale(1.1);
            }

            .peterai-trigger.hidden {
                display: none;
            }
            
            /* Ajuste del SVG para el nuevo icono */
            .peterai-trigger svg {
                width: 60px;
                height: 60px;
            }

            .peterai-header {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .peterai-title {
                color: white;
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .peterai-controls {
                display: flex;
                gap: 10px;
            }

            .peterai-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 5px;
                transition: background 0.2s ease;
            }

            .peterai-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .peterai-auth {
                padding: 30px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                flex: 1;
                justify-content: center;
                align-items: center;
            }

            .peterai-auth h3 {
                color: white;
                margin: 0 0 20px 0;
                text-align: center;
            }

            .peterai-input {
                width: 100%;
                padding: 12px 15px;
                border: none;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }

            .peterai-input:focus {
                outline: none;
                background: white;
                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
            }

            .peterai-login-btn {
                width: 100%;
                padding: 12px;
                background: white;
                color: #2c5f5f;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .peterai-login-btn:hover {
                background: #f0f0f0;
                transform: translateY(-1px);
            }

            .peterai-login-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .peterai-chat {
                display: none;
                flex-direction: column;
                flex: 1;
                height: 100%;
            }

            .peterai-chat.active {
                display: flex;
            }

            .peterai-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .peterai-message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                animation: fadeInUp 0.3s ease;
            }

            .peterai-message.user {
                background: white;
                color: #2c5f5f;
                align-self: flex-end;
                margin-left: auto;
            }

            .peterai-message.ai {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                align-self: flex-start;
            }

            .peterai-message.system {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.8);
                align-self: center;
                font-size: 12px;
                font-style: italic;
            }

            .peterai-input-area {
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                gap: 10px;
                align-items: flex-end;
            }

            .peterai-chat-input {
                flex: 1;
                padding: 12px 15px;
                border: none;
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                resize: none;
                min-height: 20px;
                max-height: 100px;
                font-family: inherit;
            }

            .peterai-chat-input:focus {
                outline: none;
                background: white;
            }

            .peterai-send-btn {
                width: 40px;
                height: 40px;
                background: white;
                color: #2c5f5f;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .peterai-send-btn:hover {
                background: #f0f0f0;
                transform: scale(1.05);
            }

            .peterai-send-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .peterai-typing {
                display: none;
                align-items: center;
                gap: 5px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 12px;
                padding: 10px 20px;
            }

            .peterai-typing.active {
                display: flex;
            }

            .peterai-typing-dots {
                display: flex;
                gap: 3px;
            }

            .peterai-typing-dot {
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: typingDot 1.4s infinite;
            }

            .peterai-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .peterai-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            .peterai-error {
                background: rgba(255, 0, 0, 0.1);
                color: #ff6b6b;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 12px;
                margin-top: 10px;
                border: 1px solid rgba(255, 107, 107, 0.3);
            }

            @media (max-width: 480px) {
                .peterai-widget {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 40px);
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    border-radius: 15px;
                }

                .peterai-trigger {
                    bottom: 30px;
                    right: 30px;
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes typingDot {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            .peterai-messages::-webkit-scrollbar {
                width: 6px;
            }

            .peterai-messages::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
            }

            .peterai-messages::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
            }

            .peterai-messages::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Función para crear el HTML del widget
    function createWidgetHTML() {
        return `
            <div class="peterai-trigger" id="peteraiTrigger">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 4C19.78 4 11.2 12.0588 11.2 22V24C11.2 26.1718 11.8437 28.2713 13.0284 30L19.4284 36.4C21.4338 38.4116 23.9317 39.7348 26.69 40.2319V44C26.69 45.1046 27.5854 46 28.69 46H31.31C32.4146 46 33.31 45.1046 33.31 44V40.2319C36.0683 39.7348 38.5662 38.4116 40.5716 36.4L46.9716 30C48.1563 28.2713 48.8 26.1718 48.8 24V22C48.8 12.0588 40.22 4 30 4ZM20 22C20 20.8954 20.8954 20 22 20H38C39.1046 20 40 20.8954 40 22V28C40 29.1046 39.1046 30 38 30H22C20.8954 30 20 29.1046 20 28V22ZM24.5 24C24.5 25.1046 25.3954 26 26.5 26H33.5C34.6046 26 35.5 25.1046 35.5 24C35.5 22.8954 34.6046 22 33.5 22H26.5C25.3954 22 24.5 22.8954 24.5 24Z" fill="#2c5f5f"/>
                    <rect x="22" y="14" width="2" height="2" rx="1" fill="#FFFFFF"/>
                    <rect x="36" y="14" width="2" height="2" rx="1" fill="#FFFFFF"/>
                </svg>
            </div>

            <div class="peterai-widget" id="peteraiWidget">
                <div class="peterai-header">
                    <h3 class="peterai-title">
                        <svg width="24" height="24" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 4C19.78 4 11.2 12.0588 11.2 22V24C11.2 26.1718 11.8437 28.2713 13.0284 30L19.4284 36.4C21.4338 38.4116 23.9317 39.7348 26.69 40.2319V44C26.69 45.1046 27.5854 46 28.69 46H31.31C32.4146 46 33.31 45.1046 33.31 44V40.2319C36.0683 39.7348 38.5662 38.4116 40.5716 36.4L46.9716 30C48.1563 28.2713 48.8 26.1718 48.8 24V22C48.8 12.0588 40.22 4 30 4ZM20 22C20 20.8954 20.8954 20 22 20H38C39.1046 20 40 20.8954 40 22V28C40 29.1046 39.1046 30 38 30H22C20.8954 30 20 29.1046 20 28V22ZM24.5 24C24.5 25.1046 25.3954 26 26.5 26H33.5C34.6046 26 35.5 25.1046 35.5 24C35.5 22.8954 34.6046 22 33.5 22H26.5C25.3954 22 24.5 22.8954 24.5 24Z" fill="#FFFFFF"/>
                            <rect x="22" y="14" width="2" height="2" rx="1" fill="#2c5f5f"/>
                            <rect x="36" y="14" width="2" height="2" rx="1" fill="#2c5f5f"/>
                        </svg>
                        PeterAI
                    </h3>
                    <div class="peterai-controls">
                        <button class="peterai-btn" id="peteraiMinimizeBtn" title="Minimizar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="11" width="14" height="2" fill="currentColor"/>
                            </svg>
                        </button>
                        <button class="peterai-btn" id="peteraiCloseBtn" title="Cerrar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="peterai-auth" id="peteraiAuth">
                    <h3>Acceso a PeterAI</h3>
                    <input type="text" class="peterai-input" id="peteraiUsername" placeholder="Usuario" autocomplete="username">
                    <input type="password" class="peterai-input" id="peteraiPassword" placeholder="Contraseña" autocomplete="current-password">
                    <button class="peterai-login-btn" id="peteraiLoginBtn">Iniciar Sesión</button>
                    <div class="peterai-error" id="peteraiAuthError" style="display: none;"></div>
                </div>

                <div class="peterai-chat" id="peteraiChat">
                    <div class="peterai-messages" id="peteraiMessages">
                        <div class="peterai-message system">
                            ¡Hola! Soy PeterAI, tu asistente de IA para Sanaltek Dataworks. ¿En qué puedo ayudarte hoy?
                        </div>
                    </div>
                    
                    <div class="peterai-typing" id="peteraiTyping">
                        <span>PeterAI está escribiendo</span>
                        <div class="peterai-typing-dots">
                            <div class="peterai-typing-dot"></div>
                            <div class="peterai-typing-dot"></div>
                            <div class="peterai-typing-dot"></div>
                        </div>
                    </div>

                    <div class="peterai-input-area">
                        <textarea class="peterai-chat-input" id="peteraiChatInput" placeholder="Escribe tu mensaje..." rows="1"></textarea>
                        <button class="peterai-send-btn" id="peteraiSendBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Clase principal del widget
    class PeterAIWidget {
        constructor(config) {
            this.config = { ...PETERAI_CONFIG, ...config };
            this.token = localStorage.getItem('peterai_token');
            this.isOpen = false;
            this.isMinimized = false;
            this.isAuthenticated = false;
            
            this.init();
        }

        init() {
            // Cargar estilos
            loadCSS();
            
            // Crear HTML del widget
            const widgetContainer = document.createElement('div');
            widgetContainer.innerHTML = createWidgetHTML();
            document.body.appendChild(widgetContainer);
            
            // Inicializar elementos
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
            this.chatInput = document.getElementById('peteraiChatInput');
            this.sendBtn = document.getElementById('peteraiSendBtn');
            this.loginBtn = document.getElementById('peteraiLoginBtn');
            this.usernameInput = document.getElementById('peteraiUsername');
            this.passwordInput = document.getElementById('peteraiPassword');
            this.authError = document.getElementById('peteraiAuthError');
            this.minimizeBtn = document.getElementById('peteraiMinimizeBtn');
            this.closeBtn = document.getElementById('peteraiCloseBtn');
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
                    // Verificar si el token es válido usando la función de verificación
                    const response = await fetch(`${this.config.apiBaseUrl}/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.valid) {
                            this.isAuthenticated = true;
                            this.showChatArea();
                            
                            // Verificar si el token expira pronto (menos de 1 hora)
                            if (data.expiresIn < 3600) {
                                this.addMessage('system', 'Tu sesión expirará pronto. Considera renovar tu autenticación.');
                            }
                        } else {
                            this.clearToken();
                        }
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
                const response = await fetch(`${this.config.apiBaseUrl}/auth`, {
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

        async logout() {
            if (!this.token) return;

            try {
                await fetch(`${this.config.apiBaseUrl}/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            } catch (error) {
                console.error('Error en logout:', error);
            } finally {
                this.clearToken();
                this.showAuthArea();
                this.addMessage('system', 'Sesión cerrada exitosamente.');
            }
        }

        async sendMessage() {
            const message = this.chatInput.value.trim();
            if (!message || !this.isAuthenticated) return;

            this.addMessage('user', message);
            this.chatInput.value = '';
            this.autoResizeTextarea();

            this.showTyping();
            this.sendBtn.disabled = true;

            try {
                const response = await fetch(`${this.config.apiBaseUrl}/chat`, {
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
                    
                    // Mostrar información adicional si hay tareas específicas
                    if (data.specificTask) {
                        this.handleSpecificTask(data.specificTask);
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

        handleSpecificTask(taskResult) {
            if (taskResult.type === 'web_search') {
                this.addMessage('system', `Búsqueda realizada: ${taskResult.query}`);
            } else if (taskResult.type === 'request_registration') {
                this.addMessage('system', 'Solicitud registrada en el sistema.');
            } else if (taskResult.type === 'email_draft') {
                this.addMessage('system', 'Borrador de correo generado.');
            }
        }

        addMessage(type, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `peterai-message ${type}`;
            messageDiv.textContent = content;
            
            this.messages.appendChild(messageDiv);
            this.scrollToBottom();
        }

        getRecentContext() {
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

    // Función de inicialización global
    window.initPeterAI = function(config = {}) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.peterAI = new PeterAIWidget(config);
            });
        } else {
            window.peterAI = new PeterAIWidget(config);
        }
    };

    // Auto-inicialización si no se especifica lo contrario
    if (!window.PETERAI_MANUAL_INIT) {
        window.initPeterAI();
    }

})();
