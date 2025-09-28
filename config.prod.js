// config.prod.js - Client-safe fallback config for production/static builds
// LƯU Ý: process.env không tồn tại trên trình duyệt, nên không dùng ở đây.
const PROD_CONFIG = {
    API_KEY: "@gemini-api-key", // placeholder, KHÔNG dùng cho local
    API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_CHAT_HISTORY: 50,
    THINKING_DELAY: 500,
    DEBUG: false
};

// Chỉ gán nếu chưa có (ví dụ: khi không có config.js)
window.CONFIG = window.CONFIG || PROD_CONFIG;
