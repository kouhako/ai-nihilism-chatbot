// config.prod.js - Sử dụng Vercel Environment Variables
const CONFIG = {
    // Vercel sẽ thay thế @gemini-api-key bằng giá trị thật
    API_KEY: "@gemini-api-key",
    
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_CHAT_HISTORY: 50,
    THINKING_DELAY: 500,
    DEBUG: false
};

window.CONFIG = CONFIG;