// ============================================
// Madurai Smart Assistant — Express Server
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const config = require('./config/config');
const { sendMessage, sendImageMessage, clearSession } = require('./utils/aiClient');
const { getCrowdStatus } = require('./modules/crowdEstimator');
const integrations = require('./services');

const app = express();

// Multer config — store in memory as buffer (for base64 conversion)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
        }
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- API Routes ----

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        name: 'Madurai Smart Assistant',
        timestamp: new Date().toISOString(),
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default', mode = 'normal' } = req.body;

        // Validate mode
        const validModes = ['kid', 'normal', 'elder'];
        const safeMode = validModes.includes(mode) ? mode : 'normal';

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid message.',
            });
        }

        const result = await sendMessage(sessionId, message.trim(), safeMode);
        res.json(result);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
            success: false,
            message: 'An internal error occurred. Please try again.',
        });
    }
});

// Crowd status endpoint
app.get('/api/crowd', async (req, res) => {
    try {
        const place = req.query.place || 'Meenakshi Amman Temple';
        const status = await getCrowdStatus(place);
        res.json({ success: true, ...status });
    } catch (error) {
        console.error('Crowd API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch crowd status.',
        });
    }
});

// Clear chat session
app.post('/api/clear', (req, res) => {
    const { sessionId = 'default' } = req.body;
    clearSession(sessionId);
    res.json({ success: true, message: 'Chat history cleared.' });
});

// Image upload + chat endpoint
app.post('/api/chat/image', upload.single('image'), async (req, res) => {
    try {
        const { message = '', sessionId = 'default', mode = 'normal' } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded.' });
        }

        const validModes = ['kid', 'normal', 'elder'];
        const safeMode = validModes.includes(mode) ? mode : 'normal';

        // Convert buffer to base64
        const imageBase64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        const result = await sendImageMessage(sessionId, message.trim(), imageBase64, mimeType, safeMode);
        res.json(result);
    } catch (error) {
        console.error('Image Upload Error:', error.message);

        if (error.message.includes('allowed')) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to process image. Please try again.',
        });
    }
});

// Integration services status
app.get('/api/services', (req, res) => {
    res.json({ success: true, services: integrations.getStatus() });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- Start Server ----
app.listen(config.port, async () => {
    console.log('');
    console.log('🛕 ═══════════════════════════════════════════');
    console.log('   MADURAI SMART ASSISTANT');
    console.log('   Your AI Guide to Madurai, Tamil Nadu');
    console.log('🛕 ═══════════════════════════════════════════');
    console.log('');
    console.log(`   🌐 Server running at: http://localhost:${config.port}`);
    console.log(`   📡 API endpoint:      http://localhost:${config.port}/api/chat`);
    console.log(`   👥 Crowd status:      http://localhost:${config.port}/api/crowd`);
    console.log(`   🔌 Services status:   http://localhost:${config.port}/api/services`);
    console.log(`   💚 Health check:       http://localhost:${config.port}/api/health`);
    console.log('');

    // Initialize integration services
    console.log('   📦 Initializing integrations...');
    await integrations.initializeAll();

    console.log('');
    console.log('   Ready to help explore Madurai! 🎉');
    console.log('');
});
