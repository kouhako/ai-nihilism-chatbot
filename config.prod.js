// config.prod.js - Production config (safe to commit)
const CONFIG = {
    // API key sẽ được inject từ Vercel Environment Variables
    API_KEY: process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE",
    
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_CHAT_HISTORY: 50,
    THINKING_DELAY: 500,
    DEBUG: false
};

window.CONFIG = CONFIG;