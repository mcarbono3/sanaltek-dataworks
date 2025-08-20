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
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #fff;
                transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
                transform: scale(0.95);
                opacity: 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .peterai-widget.open {
                transform: scale(1);
                opacity: 1;
            }
            
            .peterai-widget.minimized {
                height: 50px;
                transform: scale(0.8) translateY(20px);
                opacity: 0;
                pointer-events: none;
            }

            .peterai-trigger {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #4CB963;
                border-radius: 50%;
                box-shadow: 0 10px 20px rgba(76, 185, 99, 0.3);
                z-index: 10001;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            }

            .peterai-trigger.hidden {
                transform: scale(0);
                opacity: 0;
                pointer-events: none;
            }

            .peterai-trigger .icon {
                color: #FFFFFF;
                font-size: 24px;
            }

            .peterai-header {
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: grab;
            }
            
            .peterai-header-left {
                display: flex;
                align-items: center;
            }
            
            .peterai-header .logo {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .peterai-header .title {
                font-size: 18px;
                font-weight: 600;
            }

            .peterai-header-right {
                display: flex;
                align-items: center;
            }

            .peterai-header-right button {
                background: none;
                border: none;
                color: #FFFFFF;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
            }

            .peterai-body {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }

            .peterai-auth, .peterai-chat {
                display: none;
                flex-direction: column;
                height: 100%;
                padding: 20px;
            }

            .peterai-auth.active, .peterai-chat.active {
                display: flex;
            }

            .peterai-messages {
                flex-grow: 1;
                overflow-y: auto;
                padding-right: 10px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                scrollbar-width: thin;
                scrollbar-color: #4a8080 #2c5f5f;
            }
            
            .peterai-messages::-webkit-scrollbar {
                width: 8px;
            }
            
            .peterai-messages::-webkit-scrollbar-track {
                background: #2c5f5f;
            }
            
            .peterai-messages::-webkit-scrollbar-thumb {
                background-color: #4a8080;
                border-radius: 4px;
                border: 2px solid #2c5f5f;
            }

            .peterai-message {
                max-width: 85%;
                padding: 12px 18px;
                border-radius: 18px;
                line-height: 1.5;
                word-wrap: break-word;
                animation: fadeIn 0.3s ease-in-out;
            }

            .peterai-message.bot {
                background: rgba(255, 255, 255, 0.15);
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }

            .peterai-message.user {
                background: #4CB963;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            
            .peterai-typing {
                font-style: italic;
                color: rgba(255, 255, 255, 0.6);
                padding: 10px 0;
            }

            .peterai-input-area {
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex; /* Asegura que el área de entrada sea un flex container */
                align-items: flex-end; /* Alinea los elementos en la parte inferior */
                gap: 10px;
            }

            .peterai-input-area textarea {
                flex-grow: 1;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 18px;
                padding: 10px 15px;
                color: #fff;
                font-size: 14px;
                resize: none;
                overflow: hidden;
                transition: height 0.2s ease-in-out;
            }
            
            .peterai-input-area textarea:focus {
                outline: none;
                border-color: #4CB963;
            }
            
            .peterai-input-area button {
                background: #4CB963;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                transition: background 0.2s ease-in-out;
            }
            
            .peterai-input-area button:hover {
                background: #3a8c4c;
            }

            /* Estilos para el formulario de login */
            .peterai-auth .input-group {
                margin-bottom: 15px;
            }
            
            .peterai-auth .input-group input {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .peterai-auth button {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                background: #4CB963;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s ease-in-out;
            }

            .peterai-auth button:hover {
                background: #3a8c4c;
            }
            
            .peterai-auth .error-message {
                color: #ff6b6b;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }

            /* Animaciones */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Temas */
            .peterai-widget.sanaltek {
                background: linear-gradient(135deg, #1E5F74 0%, #3CAEA3 100%);
            }
            
            .peterai-widget.sanaltek .peterai-message.user {
                background: #4CB963;
            }
            
            .peterai-widget.sanaltek .peterai-input-area button {
                background: #4CB963;
            }
            
            .peterai-widget.sanaltek .peterai-input-area button:hover {
                background: #3a8c4c;
            }
            
            .peterai-widget.sanaltek .peterai-auth button {
                background: #4CB963;
            }
            
            .peterai-widget.sanaltek .peterai-auth button:hover {
                background: #3a8c4c;
            }
            
            .peterai-widget.dark {
                background: #333;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .peterai-widget.dark .peterai-header {
                background: #222;
                border-bottom: 1px solid #444;
            }
            
            .peterai-widget.dark .peterai-message.bot {
                background: #444;
                color: #fff;
            }

            .peterai-widget.dark .peterai-message.user {
                background: #007bff;
            }

            .peterai-widget.light {
                background: #fff;
                color: #333;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }

            .peterai-widget.light .peterai-header {
                background: #f0f0f0;
                border-bottom: 1px solid #ddd;
                color: #333;
            }
            
            .peterai-widget.light .peterai-header-right button {
                color: #333;
            }
            
            .peterai-widget.light .peterai-message.bot {
                background: #f0f0f0;
                color: #333;
            }

            .peterai-widget.light .peterai-message.user {
                background: #4CB963;
                color: #fff;
            }

            .peterai-widget.light .peterai-input-area textarea {
                background: #f0f0f0;
                border-color: #ddd;
                color: #333;
            }

            .peterai-widget.light .peterai-input-area textarea:focus {
                border-color: #4CB963;
            }

            .peterai-widget.light .peterai-input-area button {
                background: #4CB963;
            }
            
            .peterai-widget.light .peterai-input-area button:hover {
                background: #3a8c4c;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }
    
    // Función para crear el HTML del widget
    function createWidgetHTML() {
        const html = `
            <!-- Botón de disparo -->
            <div id="peteraiTrigger" class="peterai-trigger">
                <img src="https://placehold.co/60x60/1E5F74/FFFFFF?text=IA" alt="PeterAI Icon" style="width: 100%; height: 100%; border-radius: 50%;">
            </div>

            <!-- Contenedor principal del widget -->
            <div id="peteraiWidget" class="peterai-widget ${PETERAI_CONFIG.theme}">
                <!-- Encabezado del widget -->
                <div class="peterai-header">
                    <div class="peterai-header-left">
                        <img src="https://placehold.co/60x60/1E5F74/FFFFFF?text=IA" alt="PeterAI Logo" class="logo">
                        <span class="title">PeterAI</span>
                    </div>
                    <div class="peterai-header-right">
                        <button id="minimizeBtn" title="Minimizar"><span>&#x2212;</span></button>
                        <button id="closeBtn" title="Cerrar"><span>&times;</span></button>
                    </div>
                </div>

                <!-- Cuerpo del widget -->
                <div class="peterai-body">
                    <!-- Área de autenticación/login -->
                    <div id="peteraiAuth" class="peterai-auth">
                        <h2>Accede para continuar</h2>
                        <div class="input-group">
                            <input type="text" id="username" placeholder="Nombre de usuario" required>
                        </div>
                        <div class="input-group">
                            <input type="password" id="password" placeholder="Contraseña" required>
                        </div>
                        <button id="loginBtn">Acceder</button>
                        <p id="authError" class="error-message">Usuario o contraseña incorrectos.</p>
                    </div>

                    <!-- Área de chat -->
                    <div id="peteraiChat" class="peterai-chat">
                        <div id="peteraiMessages" class="peterai-messages">
                            <!-- Los mensajes se insertarán aquí -->
                        </div>
                        <!-- Área de escritura y envío de mensajes -->
                        <div class="peterai-input-area">
                            <textarea id="chatInput" placeholder="Escribe tu mensaje..."></textarea>
                            <button id="sendBtn" title="Enviar">&#x27A4;</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // Clase principal del widget
    class PeterAIWidget {
        constructor() {
            this.apiBaseUrl = PETERAI_CONFIG.apiBaseUrl;
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
            this.chatInput = document.getElementById('chatInput');
            this.sendBtn = document.getElementById('sendBtn');
            this.loginBtn = document.getElementById('loginBtn');
            this.usernameInput = document.getElementById('username');
            this.passwordInput = document.getElementById('password');
            this.authError = document.getElementById('authError');
            this.minimizeBtn = document.getElementById('minimizeBtn');
            this.closeBtn = document.getElementById('closeBtn');

            // Asegurar que el área de chat está configurada correctamente
            const inputArea = this.chatArea.querySelector('.peterai-input-area');
            if (inputArea && this.chatInput && this.sendBtn) {
                inputArea.appendChild(this.chatInput);
                inputArea.appendChild(this.sendBtn);
            }
        }

        bindEvents() {
            if (this.trigger) {
                this.trigger.addEventListener('click', () => this.toggleWidget());
            }

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.closeWidget());
            }

            if (this.minimizeBtn) {
                this.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
            }
            
            // Evento para el botón de enviar
            if (this.sendBtn) {
                this.sendBtn.addEventListener('click', () => {
                    const message = this.chatInput.value.trim();
                    if (message) {
                        this.sendMessage(message);
                    }
                });
            }

            // Evento para la tecla Enter en el input de chat
            if (this.chatInput) {
                this.chatInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendBtn.click();
                    }
                });
                
                this.chatInput.addEventListener('input', () => this.autoResizeTextarea());
            }

            // Evento para el botón de login
            if (this.loginBtn) {
                this.loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.authenticateUser();
                });
            }
        }

        async checkAuthentication() {
            if (this.token) {
                // Validación del token (opcional, se puede implementar en el backend)
                // Por ahora, asumimos que si hay un token, el usuario está autenticado
                this.isAuthenticated = true;
                this.renderUI();
                if (PETERAI_CONFIG.showWelcomeMessage) {
                    this.addMessage({ role: 'bot', text: '¡Bienvenido de nuevo! ¿En qué puedo ayudarte hoy?' });
                }
            } else {
                this.isAuthenticated = false;
                this.renderUI();
            }
        }

        async authenticateUser() {
            const username = this.usernameInput.value.trim();
            const password = this.passwordInput.value.trim();

            if (!username || !password) {
                this.authError.style.display = 'block';
                this.authError.textContent = 'Por favor, ingresa un nombre de usuario y una contraseña.';
                return;
            }

            try {
                const response = await fetch(`${this.apiBaseUrl}/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.token = data.token;
                    localStorage.setItem('peterai_token', this.token);
                    this.isAuthenticated = true;
                    this.renderUI();
                    this.addMessage({ role: 'bot', text: '¡Bienvenido a PeterAI! ¿En qué puedo ayudarte hoy?' });
                } else {
                    this.authError.style.display = 'block';
                    this.authError.textContent = 'Usuario o contraseña incorrectos.';
                }
            } catch (error) {
                console.error('Error de autenticación:', error);
                this.authError.style.display = 'block';
                this.authError.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
            }
        }

        renderUI() {
            if (this.isAuthenticated) {
                this.authArea.classList.remove('active');
                this.chatArea.classList.add('active');
            } else {
                this.chatArea.classList.remove('active');
                this.authArea.classList.add('active');
            }
        }

        async sendMessage(message) {
            // Añadir mensaje del usuario a la UI
            this.addMessage({ role: 'user', text: message });
            this.chatInput.value = '';
            this.autoResizeTextarea();

            // Simular respuesta de la IA
            this.showTypingIndicator();
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un delay de 1.5s

            // Llamada a la API de generación de texto
            const prompt = message;
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "" 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const botResponse = result.candidates[0].content.parts[0].text;
                    this.hideTypingIndicator();
                    this.addMessage({ role: 'bot', text: botResponse });
                } else {
                    this.hideTypingIndicator();
                    this.addMessage({ role: 'bot', text: 'Lo siento, no pude generar una respuesta. Por favor, inténtalo de nuevo.' });
                }
            } catch (error) {
                console.error("Error al llamar a la API de Gemini:", error);
                this.hideTypingIndicator();
                this.addMessage({ role: 'bot', text: 'Hubo un problema de conexión. Por favor, inténtalo de nuevo más tarde.' });
            }
        }

        addMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('peterai-message', message.role);
            messageElement.textContent = message.text;
            this.messages.appendChild(messageElement);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            const typingIndicator = document.createElement('div');
            typingIndicator.id = 'peteraiTyping';
            typingIndicator.classList.add('peterai-typing');
            typingIndicator.textContent = 'PeterAI está escribiendo...';
            this.messages.appendChild(typingIndicator);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            const typingIndicator = document.getElementById('peteraiTyping');
            if (typingIndicator) {
                typingIndicator.remove();
            }
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
            this.isMinimized = false;
            
            setTimeout(() => {
                if (this.isAuthenticated) {
                    this.chatInput.focus();
                } else {
                    this.usernameInput.focus();
                }
            }, 300);
            
            // FIX: Asegurar que el área de entrada esté visible al abrir el chat
            const inputArea = this.chatArea.querySelector('.peterai-input-area');
            if (inputArea) {
                inputArea.style.display = 'flex';
            }
        }

        closeWidget() {
            this.widget.classList.remove('open');
            this.widget.classList.remove('minimized');
            this.trigger.classList.remove('hidden');
            this.isOpen = false;
            this.isMinimized = false;
            // FIX: Ocultar el área de entrada al cerrar el chat
            const inputArea = this.chatArea.querySelector('.peterai-input-area');
            if (inputArea) {
                inputArea.style.display = 'none';
            }
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
                createWidgetHTML();
                loadCSS();
                window.peterAI = new PeterAIWidget(config);
            });
        } else {
            createWidgetHTML();
            loadCSS();
            window.peterAI = new PeterAIWidget(config);
        }
    };

    // Auto-inicialización si no se especifica lo contrario
    if (!window.PETERAI_MANUAL_INIT) {
        window.initPeterAI();
    }

})();
