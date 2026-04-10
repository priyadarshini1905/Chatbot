// ============================================
// AI Client — Ollama (Local) + Groq (Fallback)
// Unlimited free chats with local AI!
// ============================================

const config = require('../config/config');
const { getSystemPrompt } = require('../prompts/systemPrompt');

// Ollama config (local — no API key, no rate limits!)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

// Groq as fallback (only if Ollama is not running)
let Groq = null;
let groq = null;
try {
    Groq = require('groq-sdk');
    if (config.groqApiKey) {
        groq = new Groq({ apiKey: config.groqApiKey });
    }
} catch (e) {
    // Groq not available, that's fine
}

// Store chat histories (in-memory)
const chatHistories = new Map();

function sessionKey(sessionId, mode) {
    return `${sessionId}:${mode}`;
}

function getHistory(sessionId, mode) {
    const key = sessionKey(sessionId, mode);
    if (!chatHistories.has(key)) {
        chatHistories.set(key, []);
    }
    return chatHistories.get(key);
}

/**
 * Check if Ollama is running
 */
async function isOllamaAvailable() {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Send message via Ollama (local — unlimited!)
 */
async function sendViaOllama(messages) {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages,
            stream: false,
            options: {
                temperature: 0.7,
                num_predict: 1024,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content || 'Sorry, I could not generate a response.';
}

/**
 * Send message via Groq (cloud fallback)
 */
async function sendViaGroq(messages) {
    if (!groq) throw new Error('Groq not configured');

    const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
    });

    return chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}

/**
 * Send a message and get AI response
 */
async function sendMessage(sessionId, userMessage, mode = 'normal') {
    const history = getHistory(sessionId, mode);
    const systemPrompt = getSystemPrompt(mode);

    history.push({ role: 'user', content: userMessage });

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
    ];

    try {
        let response;

        // Try Ollama first (local = unlimited)
        const ollamaUp = await isOllamaAvailable();
        if (ollamaUp) {
            console.log('   🟢 Using Ollama (local — unlimited)');
            response = await sendViaOllama(messages);
        } else if (groq) {
            console.log('   🟡 Ollama not running, using Groq (cloud)');
            response = await sendViaGroq(messages);
        } else {
            history.pop();
            return {
                success: false,
                message: 'No AI engine available. Please start Ollama or configure GROQ_API_KEY.',
            };
        }

        history.push({ role: 'assistant', content: response });

        // Keep history short
        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        return { success: true, message: response };
    } catch (error) {
        console.error('AI Error:', error.message);
        history.pop();

        // If Groq rate limited, tell user to start Ollama
        if (error.status === 429 || (error.message && error.message.includes('rate_limit'))) {
            return {
                success: false,
                message: 'Groq rate limit reached. Start Ollama for unlimited free chats! Run: open -a Ollama 🙏',
            };
        }

        return {
            success: false,
            message: 'Sorry, I encountered an error. Please try again! 🙏',
        };
    }
}

/**
 * Send a message with an image (vision model)
 */
async function sendImageMessage(sessionId, userMessage, imageBase64, mimeType, mode = 'normal') {
    const history = getHistory(sessionId, mode);
    const systemPrompt = getSystemPrompt(mode);

    history.push({ role: 'user', content: userMessage || '[Image uploaded]' });

    try {
        let response;
        const ollamaUp = await isOllamaAvailable();

        if (ollamaUp) {
            // Ollama vision — use images field
            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.slice(0, -1),
                {
                    role: 'user',
                    content: userMessage || 'What can you tell me about this image? If related to Madurai, provide detailed information.',
                    images: [imageBase64],
                },
            ];

            const res = await fetch(`${OLLAMA_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    messages,
                    stream: false,
                }),
            });

            const data = await res.json();
            response = data.message?.content || 'Sorry, I could not analyze the image.';
        } else if (groq) {
            // Groq vision
            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.slice(0, -1),
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: userMessage || 'What is in this image?' },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
                    ],
                },
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.2-11b-vision-preview',
                temperature: 0.7,
                max_tokens: 1024,
            });

            response = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not analyze the image.';
        } else {
            history.pop();
            return { success: false, message: 'No AI engine available for image analysis.' };
        }

        history.push({ role: 'assistant', content: response });
        if (history.length > 20) history.splice(0, history.length - 20);

        return { success: true, message: response };
    } catch (error) {
        console.error('Vision AI Error:', error.message);
        history.pop();
        return {
            success: false,
            message: 'Sorry, I could not analyze your image right now. Please try again! 🙏',
        };
    }
}

/**
 * Clear all chat sessions
 */
function clearSession(sessionId) {
    ['kid', 'normal', 'elder'].forEach(mode => {
        chatHistories.delete(sessionKey(sessionId, mode));
    });
}

module.exports = { sendMessage, sendImageMessage, clearSession, isOllamaAvailable };
