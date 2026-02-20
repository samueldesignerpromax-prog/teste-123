class ChatAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.chatForm = document.getElementById('chatForm');
        this.sendButton = document.getElementById('sendButton');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        this.initEventListeners();
        this.loadChatHistory();
    }

    initEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Quick options
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.userInput.value = btn.dataset.option;
                this.sendMessage();
            });
        });

        // Enter key
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.userInput.value = '';
        
        // Disable input while processing
        this.setInputState(false);
        
        // Show loading
        this.loadingSpinner.classList.add('active');

        try {
            // Send to backend
            const response = await this.getBotResponse(message);
            
            // Add bot response
            this.addMessage(response, 'bot');
            
            // Save to history
            this.saveToHistory(message, response);
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Desculpe, tive um problema. Pode repetir?', 'bot');
        } finally {
            // Re-enable input
            this.setInputState(true);
            
            // Hide loading
            this.loadingSpinner.classList.remove('active');
        }
    }

    async getBotResponse(message) {
        // Simulate API call - Replace with actual API endpoint
        // const response = await fetch('/api/chat', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ message })
        // });
        // const data = await response.json();
        // return data.response;

        // Simulated responses for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses = {
            'serviços': 'Oferecemos: IA para Chatbots, Análise de Dados, Automação de Processos e Consultoria em IA. Qual área te interessa?',
            'preços': 'Nossos planos começam em R$ 97/mês. Temos opções para empresas de todos os portes. Gostaria de uma proposta personalizada?',
            'contato': 'Você pode nos contatar pelo email: contato@samueltechia.com ou telefone: (11) 99999-9999',
            'suporte': 'Nosso suporte funciona 24/7. Como posso ajudar especificamente?',
            'default': 'Entendi sua mensagem. Em breve um de nossos atendentes entrará em contato. Enquanto isso, posso ajudar com mais informações?'
        };

        const lowerMessage = message.toLowerCase();
        let response = responses.default;
        
        for (let [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        return response;
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                <p>${this.escapeHtml(text)}</p>
            </div>
            <span class="timestamp">${time}</span>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setInputState(enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.userInput.focus();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    loadChatHistory() {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            const messages = JSON.parse(history);
            messages.forEach(msg => {
                this.addMessage(msg.text, msg.sender);
            });
        }
    }

    saveToHistory(userMessage, botMessage) {
        const history = localStorage.getItem('chatHistory');
        let messages = history ? JSON.parse(history) : [];
        
        messages.push(
            { text: userMessage, sender: 'user', timestamp: Date.now() },
            { text: botMessage, sender: 'bot', timestamp: Date.now() }
        );
        
        // Keep only last 50 messages
        if (messages.length > 50) {
            messages = messages.slice(-50);
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatAssistant();
});
