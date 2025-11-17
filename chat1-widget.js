// Interactive Chat Widget for n8n (COMPLETE FIXED VERSION)
// All styles included, service options working properly
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    const PRECHAT_ENABLED = false;
    const AUTO_GREETING = "Hello! Adan Construction AI Agent — how can I help you today?";

    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget { font-family: 'Poppins', sans-serif; }
        
        /* Launch Button */
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 16px 24px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(16,185,129,0.3);
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side { left: 20px; }
        .chat-assist-widget .chat-launcher:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16,185,129,0.4);
        }
        
        /* Chat Window */
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            border: 1px solid #d1fae5;
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side { left: 20px; }
        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        /* Chat Header */
        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            position: relative;
        }
        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            object-fit: contain;
            background: white;
            padding: 4px;
        }
        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }
        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
            font-size: 18px;
            border-radius: 50%;
            width: 28px;
            height: 28px;
        }
        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-50%) scale(1.1);
        }
        
        /* Welcome Screen */
        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
        }
        .chat-assist-widget .chat-welcome-title {
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 24px;
            line-height: 1.3;
        }
        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
            font-weight: 600;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px rgba(16,185,129,0.15);
        }
        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px rgba(16,185,129,0.2);
        }
        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        
        /* Chat Body */
        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
        }
        .chat-assist-widget .chat-body.active {
            display: flex;
        }
        
        /* Messages Container */
        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        /* Chat Bubbles */
        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: 12px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 4px rgba(16,185,129,0.2);
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: #1f2937;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
        }
        
        /* Service Options Buttons */
        .chat-assist-widget .service-options {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 8px 0;
            align-self: flex-start;
            max-width: 85%;
        }
        .chat-assist-widget .service-options button {
            padding: 10px 16px;
            background: white;
            border: 2px solid #10b981;
            color: #10b981;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
            font-family: 'Poppins', sans-serif;
        }
        .chat-assist-widget .service-options button:hover {
            transform: scale(1.05);
            background: #10b981;
            color: white;
            box-shadow: 0 4px 8px rgba(16,185,129,0.2);
        }
        
        /* Typing Indicator */
        .chat-assist-widget .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 14px 18px;
            background: white;
            border-radius: 12px;
            align-self: flex-start;
            border: 1px solid #e5e7eb;
            max-width: 60px;
        }
        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: typing-bounce 1.4s infinite;
        }
        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing-bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        /* Chat Controls */
        .chat-assist-widget .chat-controls {
            padding: 16px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            background: white;
            color: #1f2937;
            resize: none;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            max-height: 120px;
            min-height: 48px;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }
        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 12px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(16,185,129,0.2);
            font-size: 18px;
            transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(16,185,129,0.3);
        }
        
        /* Footer */
        .chat-assist-widget .chat-footer {
            padding: 12px;
            text-align: center;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }
        .chat-assist-widget .chat-footer-link {
            font-size: 12px;
            color: #6b7280;
            text-decoration: none;
            transition: color 0.3s;
        }
        .chat-assist-widget .chat-footer-link:hover {
            color: #10b981;
        }
        
        /* Links in Messages */
        .chat-assist-widget .chat-link {
            color: #10b981;
            text-decoration: underline;
            font-weight: 500;
        }
        .chat-assist-widget .chat-link:hover {
            color: #059669;
        }
    `;
    document.head.appendChild(widgetStyles);

    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: 'Adan Construction',
            welcomeText: 'We're here to help!',
            responseTimeText: 'Typically replies in a few minutes',
            poweredBy: { text: 'Powered by Adan Construction', link: 'https://www.adanconstruction.net/' }
        },
        style: {
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: []
    };

    const settings = window.ChatWidgetConfig ?
        { ...defaultSettings, ...window.ChatWidgetConfig } : defaultSettings;

    let conversationId = '';
    let isWaitingForResponse = false;

    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn" aria-label="Close chat">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn">Start chatting</button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Type your message here..." rows="1"></textarea>
                <button class="chat-submit" aria-label="Send message">→</button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank" rel="noopener">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;

    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = '💬 Need help?';

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');

    function createSessionId() {
        return (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
    }

    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        return indicator;
    }

    function linkifyText(text) {
        return text.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`);
    }

    function startChatWithoutRegistration() {
        chatBody.classList.add('active');
        if (!conversationId) conversationId = createSessionId();
        
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-bubble bot-bubble';
        botMessage.textContent = AUTO_GREETING;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;

        const requestData = {
            action: "sendMessage",
            sessionId: conversationId || (conversationId = createSessionId()),
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {}
        };

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);

        const typing = createTypingIndicator();
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Check for service options
        const service = messageText.toLowerCase();
        if (['kitchen', 'bathroom', 'living room'].includes(service)) {
            showServiceOptions(service);
        }

        fetch(settings.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(r => r.json())
        .then(data => {
            if (typing.parentNode) typing.parentNode.removeChild(typing);
            
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const responseText = Array.isArray(data) ? data[0]?.output || '' : data?.output || '';
            botMessage.innerHTML = linkifyText(responseText || "I'm here to help! How can I assist you?");
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(err => {
            console.error('Chat error:', err);
            if (typing.parentNode) typing.parentNode.removeChild(typing);
            
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            botMessage.textContent = "Sorry, I couldn't send your message. Please try again.";
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .finally(() => {
            isWaitingForResponse = false;
        });
    }

    function showServiceOptions(service) {
        const existing = messagesContainer.querySelector('.service-options');
        if (existing) existing.remove();

        const wrap = document.createElement('div');
        wrap.className = 'service-options';

        let options = [];
        if (service === 'kitchen') options = ['Small Kitchen', 'Medium Kitchen', 'Large Kitchen'];
        else if (service === 'bathroom') options = ['Single Bathroom', 'Double Bathroom', 'Luxury Bathroom'];
        else if (service === 'living room') options = ['Compact Living Room', 'Standard Living Room', 'Spacious Living Room'];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                submitMessage(opt);
                wrap.remove();
            });
            wrap.appendChild(btn);
        });

        messagesContainer.appendChild(wrap);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        const h = Math.min(messageTextarea.scrollHeight, 120);
        messageTextarea.style.height = h + 'px';
    }

    startChatButton.addEventListener('click', () => {
        startChatWithoutRegistration();
    });

    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });

    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
            }
        }
    });

    let firstOpen = true;
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
        if (chatWindow.classList.contains('visible') && firstOpen) {
            startChatWithoutRegistration();
            firstOpen = false;
        }
    });

    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(btn => btn.addEventListener('click', () => chatWindow.classList.remove('visible')));
})();
