// ============================================
// Madurai Smart Assistant — Chat UI Logic
// ============================================

const API_URL = '/api/chat';
const CLEAR_URL = '/api/clear';
const STORAGE_KEY = 'madurai_chat_history';

// Generate a unique session ID
let sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
let currentConversationId = sessionId;

// DOM Elements
const chatArea = document.getElementById('chatArea');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const welcomeCard = document.getElementById('welcomeCard');
const micBtn = document.getElementById('micBtn');
const speakerBtn = document.getElementById('speakerBtn');
const voiceStatus = document.getElementById('voiceStatus');
const uploadBtn = document.getElementById('uploadBtn');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const previewClose = document.getElementById('previewClose');

// Sidebar DOM
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const newChatBtn = document.getElementById('newChatBtn');
const conversationList = document.getElementById('conversationList');

// State
let isProcessing = false;
let currentMode = 'normal';
let isRecording = false;
let isSpeakerOn = false;
let recognition = null;
let pendingImage = null; // { file, dataUrl }

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    messageInput.focus();
    setupEventListeners();
    initSpeechRecognition();
    loadConversationList();
});

function setupEventListeners() {
    // Send on button click
    sendBtn.addEventListener('click', handleSend);

    // Send on Enter key
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Clear chat
    clearBtn.addEventListener('click', handleClear);

    // Topic pill clicks
    document.querySelectorAll('.topic-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const query = pill.getAttribute('data-query');
            messageInput.value = query;
            handleSend();
        });
    });

    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newMode = btn.getAttribute('data-mode');
            if (newMode === currentMode) return;

            // Update active state
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = newMode;

            // Show a system message about the mode change
            const modeLabels = { kid: '👦 Kid Mode', normal: '👤 Normal Mode', elder: '🙏 Elder Mode' };
            const modeDescs = {
                kid: 'Simple & fun language for kids',
                normal: 'Clear & balanced responses',
                elder: 'Respectful & detailed explanations'
            };
            addSystemMessage(`Switched to ${modeLabels[newMode]} — ${modeDescs[newMode]}`);
        });
    });

    // Image upload
    uploadBtn.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            addSystemMessage('⚠️ Image too large! Maximum size is 5MB.');
            imageInput.value = '';
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            pendingImage = { file, dataUrl: ev.target.result };
            previewImg.src = ev.target.result;
            imagePreview.style.display = 'flex';
            uploadBtn.classList.add('has-image');
            messageInput.placeholder = 'Add a message about this image (optional)...';
            messageInput.focus();
        };
        reader.readAsDataURL(file);
    });

    previewClose.addEventListener('click', clearImagePreview);

    // Sidebar events
    hamburgerBtn.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    newChatBtn.addEventListener('click', startNewChat);
}

// ---- Send Message ----
async function handleSend() {
    const message = messageInput.value.trim();
    const hasImage = !!pendingImage;

    if (!message && !hasImage) return;
    if (isProcessing) return;

    isProcessing = true;
    sendBtn.disabled = true;

    // Hide welcome card
    if (welcomeCard) {
        welcomeCard.style.display = 'none';
    }

    // Add user message (with image if attached)
    addMessage(message || '🖼️ [Image]', 'user', hasImage ? pendingImage.dataUrl : null);
    messageInput.value = '';

    // Show typing indicator
    const typingEl = showTypingIndicator();

    try {
        let data;

        if (hasImage) {
            // Send image via FormData
            const formData = new FormData();
            formData.append('image', pendingImage.file);
            formData.append('message', message);
            formData.append('sessionId', sessionId);
            formData.append('mode', currentMode);

            const response = await fetch('/api/chat/image', {
                method: 'POST',
                body: formData,
            });
            data = await response.json();

            clearImagePreview();
        } else {
            // Send text-only
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId, mode: currentMode }),
            });
            data = await response.json();
        }

        // Remove typing indicator
        removeTypingIndicator(typingEl);

        // Add bot response
        if (data.success) {
            addMessage(data.message, 'bot');
        } else {
            addMessage(data.message || 'Sorry, something went wrong. Please try again! 🙏', 'bot');
        }
    } catch (error) {
        removeTypingIndicator(typingEl);
        addMessage('Unable to connect to the server. Please check if the server is running. 🔌', 'bot');
    }

    // Auto-save conversation after each exchange
    saveCurrentChat();

    isProcessing = false;
    sendBtn.disabled = false;
    messageInput.focus();
}

// ---- Clear Image Preview ----
function clearImagePreview() {
    pendingImage = null;
    imageInput.value = '';
    imagePreview.style.display = 'none';
    previewImg.src = '';
    uploadBtn.classList.remove('has-image');
    messageInput.placeholder = 'Ask about Madurai... temples, food, weather, hotels...';
}

// ---- Add Message to Chat ----
function addMessage(text, type, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🛕';

    const contentWrapper = document.createElement('div');

    const content = document.createElement('div');
    content.className = 'message-content';

    // Show image if attached (user messages with images)
    if (imageUrl && type === 'user') {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'message-image';
        img.alt = 'Uploaded image';
        content.appendChild(img);
    }

    if (type === 'bot') {
        content.innerHTML = formatMarkdown(text);
    } else {
        content.textContent = text;
    }

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getCurrentTime();

    contentWrapper.appendChild(content);
    contentWrapper.appendChild(time);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentWrapper);

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Auto-speak bot responses if speaker is on
    if (type === 'bot' && isSpeakerOn) {
        speakText(text);
    }
}

// ---- Add System Message (for mode changes) ----
function addSystemMessage(text) {
    const sysDiv = document.createElement('div');
    sysDiv.className = 'system-message';
    sysDiv.textContent = text;
    messagesContainer.appendChild(sysDiv);
    scrollToBottom();
}

// ---- Format Markdown ----
function formatMarkdown(text) {
    let html = text;

    // Escape HTML
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>');

    // Unordered lists
    html = html.replace(/^[*\-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Numbered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Line breaks to paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not starting with tag
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><(h[123]|ul|ol|hr)/g, '<$1');
    html = html.replace(/<\/(h[123]|ul|ol)><\/p>/g, '</$1>');

    return html;
}

// ---- Typing Indicator ----
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
    <div class="message-avatar">🛕</div>
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

// ---- Clear Chat ----
async function handleClear() {
    // Animate out messages
    const allMessages = messagesContainer.querySelectorAll('.message');
    allMessages.forEach((msg, i) => {
        msg.style.transition = `opacity 0.2s ${i * 0.03}s, transform 0.2s ${i * 0.03}s`;
        msg.style.opacity = '0';
        msg.style.transform = 'scale(0.95)';
    });

    setTimeout(async () => {
        messagesContainer.innerHTML = '';

        // Show welcome card again
        if (welcomeCard) {
            welcomeCard.style.display = '';
        }

        // Clear server session
        try {
            await fetch(CLEAR_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
        } catch (e) {
            // Silently fail
        }
    }, 300);
}

// ---- Utilities ----
function scrollToBottom() {
    requestAnimationFrame(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    });
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

// ============================================
// Voice Interaction — Speech-to-Text & Text-to-Speech
// ============================================

// ---- Initialize Speech Recognition ----
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        micBtn.style.display = 'none';
        console.log('Speech Recognition not supported in this browser.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Support multiple languages
    recognition.lang = 'en-IN'; // Default: English (India)

    recognition.onstart = () => {
        isRecording = true;
        micBtn.classList.add('recording');
        setVoiceStatus('🎤 Listening... speak now');
    };

    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Show interim results in input
        if (interimTranscript) {
            messageInput.value = interimTranscript;
            setVoiceStatus('🎤 Listening...');
        }

        // Process final result
        if (finalTranscript) {
            messageInput.value = finalTranscript;
            setVoiceStatus('✅ Got it!');
            setTimeout(() => {
                handleSend();
                setVoiceStatus('');
            }, 300);
        }
    };

    recognition.onerror = (event) => {
        isRecording = false;
        micBtn.classList.remove('recording');

        if (event.error === 'no-speech') {
            setVoiceStatus('😶 No speech detected. Try again!');
        } else if (event.error === 'not-allowed') {
            setVoiceStatus('🚫 Microphone access denied. Please allow mic access.');
        } else {
            setVoiceStatus("Sorry, I couldn't understand. Could you please repeat?");
        }

        setTimeout(() => setVoiceStatus(''), 3000);
    };

    recognition.onend = () => {
        isRecording = false;
        micBtn.classList.remove('recording');
    };

    // Mic button click
    micBtn.addEventListener('click', toggleRecording);

    // Speaker button click
    speakerBtn.addEventListener('click', toggleSpeaker);
}

// ---- Toggle Recording ----
function toggleRecording() {
    if (!recognition) return;

    if (isRecording) {
        recognition.stop();
        setVoiceStatus('');
    } else {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        // Set language based on a smart guess — allow all languages
        recognition.lang = 'en-IN';
        recognition.start();
    }
}

// ---- Toggle Speaker ----
function toggleSpeaker() {
    isSpeakerOn = !isSpeakerOn;
    speakerBtn.classList.toggle('active', isSpeakerOn);
    setVoiceStatus(isSpeakerOn ? '🔊 Voice responses ON' : '🔇 Voice responses OFF');
    setTimeout(() => setVoiceStatus(''), 2000);

    // Stop any ongoing speech when turning off
    if (!isSpeakerOn) {
        window.speechSynthesis.cancel();
        speakerBtn.classList.remove('speaking');
    }
}

// ---- Text-to-Speech ----
function speakText(text) {
    if (!isSpeakerOn || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text for speech (remove markdown, emojis, special chars)
    const cleanText = text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/---/g, '')
        .replace(/[🛕🍛🌤️🚗👥🎉✈️🏨📍📡📊🟢🟡🟠🔴🙏👦👤😊😋💚🔌🎤🔊]/gu, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\n+/g, '. ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleanText) return;

    // Detect language of the response
    const lang = detectLanguage(cleanText);

    // Split long text into chunks (speech synthesis has limits)
    const chunks = splitTextForSpeech(cleanText, 200);

    chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk);

        // Set language-specific voice
        utterance.lang = lang;

        // Mode-specific adjustments
        switch (currentMode) {
            case 'kid':
                utterance.rate = 1.05;
                utterance.pitch = 1.25; // Cheerful, slightly higher pitch
                break;
            case 'elder':
                utterance.rate = 0.8;  // Slower for elderly
                utterance.pitch = 0.95;
                break;
            default: // normal
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                break;
        }

        utterance.volume = 1.0;

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = findBestVoice(voices, lang);
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        // Visual feedback
        if (index === 0) {
            utterance.onstart = () => speakerBtn.classList.add('speaking');
        }
        utterance.onend = () => {
            if (index === chunks.length - 1) {
                speakerBtn.classList.remove('speaking');
            }
        };
        utterance.onerror = () => speakerBtn.classList.remove('speaking');

        window.speechSynthesis.speak(utterance);
    });
}

// ---- Detect Language ----
function detectLanguage(text) {
    // Check for Tamil script
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';

    // Check for Hindi/Devanagari script
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';

    // Tanglish detection — Tamil words in English letters
    const tanglishWords = ['nalla', 'romba', 'irukku', 'enga', 'enna', 'panna', 'sollu', 'podu',
        'kidaikum', 'pannunga', 'vanakkam', 'kovil', 'kadai', 'sapadu', 'thaan',
        'poi', 'vaanga', 'illa', 'aamaa', 'koil', 'dosai', 'idhu', 'adhu',
        'la ', ' la ', 'pakkam', 'area la', 'try pannunga', 'aagum', 'irukum'];
    const lowerText = text.toLowerCase();
    const tanglishCount = tanglishWords.filter(w => lowerText.includes(w)).length;
    if (tanglishCount >= 2) return 'ta-IN'; // Speak Tanglish with Tamil voice

    // Default: English (India)
    return 'en-IN';
}

// ---- Find Best Voice ----
function findBestVoice(voices, lang) {
    if (!voices.length) return null;

    // Exact language match
    let voice = voices.find(v => v.lang === lang);
    if (voice) return voice;

    // Partial match (e.g., 'ta' for 'ta-IN')
    const langPrefix = lang.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(langPrefix));
    if (voice) return voice;

    // Fallback to any Indian English voice
    voice = voices.find(v => v.lang.includes('IN'));
    if (voice) return voice;

    return null;
}

// ---- Split Text for Speech ----
function splitTextForSpeech(text, maxLen) {
    const sentences = text.split(/(?<=[.!?।])/g);
    const chunks = [];
    let current = '';

    sentences.forEach(sentence => {
        if ((current + sentence).length > maxLen && current) {
            chunks.push(current.trim());
            current = sentence;
        } else {
            current += sentence;
        }
    });

    if (current.trim()) chunks.push(current.trim());
    return chunks.length ? chunks : [text.substring(0, maxLen)];
}

// ---- Voice Status Helper ----
function setVoiceStatus(text) {
    voiceStatus.textContent = text;
}

// Preload voices (some browsers load asynchronously)
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ============================================
// Chat History — localStorage Persistence
// ============================================

// ---- Sidebar Toggle ----
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

// ---- Get All Conversations from localStorage ----
function getAllConversations() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// ---- Save All Conversations ----
function saveAllConversations(conversations) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
        console.warn('Could not save chat history:', e.message);
    }
}

// ---- Save Current Chat ----
function saveCurrentChat() {
    const messageEls = messagesContainer.querySelectorAll('.message');
    if (messageEls.length === 0) return;

    const messages = [];
    messageEls.forEach(el => {
        const type = el.classList.contains('user') ? 'user' : 'bot';
        const content = el.querySelector('.message-content');
        const imgEl = content ? content.querySelector('.message-image') : null;
        messages.push({
            type,
            text: content ? content.textContent.trim().substring(0, 500) : '',
            html: type === 'bot' && content ? content.innerHTML : null,
            image: imgEl ? imgEl.src.substring(0, 200) : null,
        });
    });

    const firstUserMsg = messages.find(m => m.type === 'user');
    const title = firstUserMsg
        ? firstUserMsg.text.substring(0, 50) + (firstUserMsg.text.length > 50 ? '...' : '')
        : 'New Chat';

    const conversations = getAllConversations();
    const existingIdx = conversations.findIndex(c => c.id === currentConversationId);

    const chatData = {
        id: currentConversationId,
        title,
        messages,
        mode: currentMode,
        updatedAt: new Date().toISOString(),
        createdAt: existingIdx >= 0 ? conversations[existingIdx].createdAt : new Date().toISOString(),
    };

    if (existingIdx >= 0) {
        conversations[existingIdx] = chatData;
    } else {
        conversations.unshift(chatData);
    }

    if (conversations.length > 30) conversations.splice(30);

    saveAllConversations(conversations);
    renderConversationList();
}

// ---- Load Conversation List in Sidebar ----
function loadConversationList() {
    renderConversationList();
}

function renderConversationList() {
    const conversations = getAllConversations();
    conversationList.innerHTML = '';

    if (conversations.length === 0) {
        conversationList.innerHTML = '<div class="sidebar-empty">No past conversations yet.<br>Start chatting! 💬</div>';
        return;
    }

    conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item' + (conv.id === currentConversationId ? ' active' : '');

        item.innerHTML = '<span class="conv-icon">💬</span>'
            + '<div class="conv-info">'
            + '<div class="conv-title">' + escapeHtml(conv.title || 'New Chat') + '</div>'
            + '<div class="conv-time">' + formatRelativeTime(conv.updatedAt) + '</div>'
            + '</div>';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'conv-delete';
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(conv.id);
        });

        item.appendChild(deleteBtn);
        item.addEventListener('click', () => loadConversation(conv.id));
        conversationList.appendChild(item);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---- Load a Conversation ----
function loadConversation(convId) {
    const conversations = getAllConversations();
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    currentConversationId = conv.id;
    sessionId = conv.id;

    if (conv.mode) {
        currentMode = conv.mode;
        document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-mode') === currentMode);
        });
    }

    messagesContainer.innerHTML = '';
    if (welcomeCard) welcomeCard.style.display = 'none';

    conv.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + msg.type;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = msg.type === 'user' ? '👤' : '🛕';

        const contentWrapper = document.createElement('div');
        const content = document.createElement('div');
        content.className = 'message-content';

        if (msg.image && msg.type === 'user') {
            const img = document.createElement('img');
            img.src = msg.image;
            img.className = 'message-image';
            content.appendChild(img);
        }

        if (msg.type === 'bot' && msg.html) {
            content.innerHTML = msg.html;
        } else {
            content.textContent = msg.text;
        }

        contentWrapper.appendChild(content);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentWrapper);
        messagesContainer.appendChild(messageDiv);
    });

    scrollToBottom();
    renderConversationList();
    closeSidebar();
}

// ---- Start New Chat ----
function startNewChat() {
    saveCurrentChat();

    sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
    currentConversationId = sessionId;

    messagesContainer.innerHTML = '';
    if (welcomeCard) welcomeCard.style.display = '';

    fetch(CLEAR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
    }).catch(() => { });

    renderConversationList();
    closeSidebar();
    messageInput.focus();
}

// ---- Delete Conversation ----
function deleteConversation(convId) {
    let conversations = getAllConversations();
    conversations = conversations.filter(c => c.id !== convId);
    saveAllConversations(conversations);

    if (convId === currentConversationId) {
        startNewChat();
    } else {
        renderConversationList();
    }
}

// ---- Format Relative Time ----
function formatRelativeTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
