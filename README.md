🌆 Madurai Smart Assistant

An AI-powered chatbot designed to help users explore Madurai, Tamil Nadu with intelligent, context-aware responses about tourist places, temples, food, travel, and more.

Built with a local-first AI architecture, the assistant delivers fast, multilingual, and personalized interactions through both text and voice.


🚀 Features
🧠 AI chatbot with local + cloud inference (Ollama + Groq)
🏛️ Information on temples, tourist spots, hotels, and food
🗣️ Voice input (speech-to-text) & audio responses (text-to-speech)
🌍 Multi-language support (English, Tamil, Hindi, Tanglish)
👶👨‍🦳 Mode-based responses (Kid / Normal / Elder)
🖼️ Image-based queries (vision-enabled prompts)
📊 Crowd estimation for popular places
💾 Session-based chat history


🏗️ Tech Stack
Backend: Node.js, Express
Frontend: HTML, CSS, JavaScript
AI: Ollama (local), Groq (fallback)
Other Tools: Multer, Dotenv


📂 Project Structure
chatbot/
├── server.js
├── config/
├── modules/
├── prompts/
├── services/
├── utils/
└── public/


⚙️ Setup & Installation
git clone <your-repo-url>
cd chatbot
npm install
🔑 Environment Setup

Create a .env file:

PORT=3000
GROQ_API_KEY=your_api_key
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma3:1b


▶️ Run the Project
npm start

Open in browser:
👉 http://localhost:3000

🔌 API Overview
GET /api/health → Check server status
POST /api/chat → Chat with assistant
POST /api/chat/image → Image + text query
GET /api/crowd → Crowd estimation
POST /api/clear → Clear session


🌐 Use Cases
Tourists exploring Madurai
Smart travel assistants
Local recommendation systems
AI-powered city guides

⚠️ Limitations
Chat history is not permanently stored
Some external services are placeholders
Requires Ollama or Groq API for AI responses


🔮 Future Improvements
Database integration for chat history
Live API integrations (maps, weather, traffic)
Authentication & user accounts
Deployment & containerization
