const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
    groqApiKey: process.env.GROQ_API_KEY,
    port: process.env.PORT || 3000,
    ollamaUrl: process.env.OLLAMA_URL || 'http://127.0.0.1:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'gemma3:1b',
};

// Groq key is now OPTIONAL (Ollama is primary)
if (config.groqApiKey === 'your_groq_api_key_here') {
    config.groqApiKey = null; // Treat placeholder as not set
}

module.exports = config;
