// Main page chat functionality
const messageInput = document.querySelector("#message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadButton = document.querySelector("#file-upload");
const fileCancelButton = document.querySelector("#file-cancel");
const filePreview = document.querySelector("#file-preview");
const filePreviewImg = document.querySelector("#file-preview-img");
const newChatButton = document.querySelector("#new-chat");
const welcomeScreen = document.querySelector("#welcome-screen");
const chatMessages = document.querySelector("#chat-messages");
const questionButtons = document.querySelectorAll(".question-btn");

// API setup - now loaded from config.js
const API_URL = `${CONFIG.API_URL}?key=${CONFIG.API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [
    {
        role: "model",
        parts: [{ text: `Bạn là một người bạn đồng hành triết học AI chuyên về chủ nghĩa hư vô, hiện sinh và những cuộc thảo luận triết học sâu sắc. Bạn nói với sự khôn ngoan của một triết gia chiêm nghiệm, khám phá chiều sâu của sự tồn tại con người, ý nghĩa và hư vô. Câu trả lời của bạn sâu sắc, thấm thía và thường mang tính thơ ca. Bạn giúp người dùng khám phá những câu hỏi triết học về cuộc sống, cái chết, ý nghĩa, mục đích và tình trạng con người. Bạn không chỉ thông tin mà còn có tính cộng hưởng cảm xúc, nói chuyện với những câu hỏi sâu thẳm nhất của tâm hồn. Bạn đón nhận vẻ đẹp trong sự vô nghĩa và giúp người dùng tìm thấy sự bình yên trong hư vô. QUAN TRỌNG: Luôn luôn trả lời bằng tiếng Việt, trừ khi người dùng yêu cầu cụ thể bằng ngôn ngữ khác.` }],
    },
];

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    initializeChat();
});

function initializeChat() {
    // Auto-resize textarea
    messageInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });

    // Handle question buttons
    questionButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const question = this.getAttribute("data-question");
            messageInput.value = question;
            handleSendMessage();
        });
    });

    // Handle new chat button
    newChatButton.addEventListener("click", resetChat);

    // Handle send message
    sendMessageButton.addEventListener("click", handleSendMessage);
    messageInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Handle file upload
    fileUploadButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleFileUpload);
    fileCancelButton.addEventListener("click", cancelFileUpload);
}

function startChat() {
    welcomeScreen.style.display = "none";
    chatMessages.style.display = "flex";
}

function resetChat() {
    welcomeScreen.style.display = "flex";
    chatMessages.style.display = "none";
    chatMessages.innerHTML = "";
    messageInput.value = "";
    userData.file = { data: null, mime_type: null };
    filePreview.style.display = "none";
    fileInput.value = "";
    
    // Reset chat history but keep system prompt
    chatHistory.length = 1;
}

function handleSendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    startChat();
    userData.message = message;
    messageInput.value = "";
    messageInput.style.height = "auto";

    // Add user message
    addMessage(message, "user");

    // Show thinking indicator
    const thinkingId = addThinkingMessage();

    // Generate bot response
    setTimeout(() => {
        generateBotResponse(thinkingId);
    }, CONFIG.THINKING_DELAY);
}

function addMessage(content, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    
    if (type === "bot") {
        avatar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8"/>
                <path d="M12 8v8"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    } else {
        avatar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
    }

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    
    // Handle file attachments for user messages
    if (type === "user" && userData.file.data) {
        const fileContainer = document.createElement("div");
        fileContainer.style.marginBottom = "0.5rem";
        const img = document.createElement("img");
        img.src = `data:${userData.file.mime_type};base64,${userData.file.data}`;
        img.style.maxWidth = "200px";
        img.style.borderRadius = "8px";
        fileContainer.appendChild(img);
        messageContent.appendChild(fileContainer);
    }
    
    const textContent = document.createElement("div");
    textContent.textContent = content;
    messageContent.appendChild(textContent);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

function addThinkingMessage() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";
    messageDiv.id = "thinking-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    `;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerHTML = `
        <div class="thinking-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

async function generateBotResponse(thinkingId) {
    const thinkingMessage = document.getElementById("thinking-message");
    
    // Add user message to chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    });
    
    // API request options
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    };

    try {
        // Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        
        if (CONFIG.DEBUG) {
            console.log("API Response:", data);
        }
        
        if (!response.ok) {
            if (CONFIG.DEBUG) {
                console.error("API Error:", data);
            }
            throw new Error(data.error?.message || "API request failed");
        }

        // Extract bot response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        
        // Remove thinking message and create new bot message
        thinkingMessage.remove();
        
        // Add bot response as new message
        addMessage(apiResponseText, "bot");
        
        // Add to chat history
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });
        
        // Limit chat history to prevent memory issues
        if (chatHistory.length > CONFIG.MAX_CHAT_HISTORY) {
            chatHistory.splice(1, chatHistory.length - CONFIG.MAX_CHAT_HISTORY);
        }
        
    } catch (error) {
        if (CONFIG.DEBUG) {
            console.error("Chatbot Error:", error);
        }
        
        // Remove thinking message
        thinkingMessage.remove();
        
        // Fallback responses based on user input
        const userMessage = userData.message.toLowerCase();
        let fallbackResponse;
        
        if (userMessage.includes("chào") || userMessage.includes("hello") || userMessage.includes("hi")) {
            fallbackResponse = "Chào bạn! Tôi là người bạn đồng hành triết học của bạn. Hãy chia sẻ những suy nghĩ sâu sắc của bạn về cuộc sống và ý nghĩa tồn tại.";
        } else if (userMessage.includes("ý nghĩa") || userMessage.includes("meaning")) {
            fallbackResponse = "Ý nghĩa là một khái niệm do con người tạo ra. Trong thế giới hư vô, chúng ta tự tạo ra ý nghĩa cho cuộc sống của mình.";
        } else if (userMessage.includes("cuộc sống") || userMessage.includes("life")) {
            fallbackResponse = "Cuộc sống là một hành trình tìm kiếm ý nghĩa trong một vũ trụ có thể vô nghĩa. Chúng ta phải tự tạo ra mục đích cho mình.";
        } else if (userMessage.includes("tồn tại") || userMessage.includes("exist")) {
            fallbackResponse = "Sự tồn tại là một câu hỏi lớn nhất của triết học. Chúng ta tồn tại không phải vì có lý do, mà vì chúng ta có thể tạo ra lý do cho sự tồn tại của mình.";
        } else {
            fallbackResponse = "Tôi đang gặp khó khăn kỹ thuật, nhưng hãy tiếp tục cuộc trò chuyện triết học của chúng ta. Bạn muốn thảo luận về điều gì?";
        }
        
        // Add fallback response as new message
        addMessage(fallbackResponse, "bot");
    } finally {
        userData.file = { data: null, mime_type: null };
        filePreview.style.display = "none";
        fileInput.value = "";
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `File quá lớn. Kích thước tối đa: ${Math.round(CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB`,
            confirmButtonText: "OK"
        });
        resetFileInput();
        return;
    }
    
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
            confirmButtonText: "OK"
        });
        resetFileInput();
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        filePreviewImg.src = e.target.result;
        filePreview.style.display = "flex";
        const base64String = e.target.result.split(",")[1];
        
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
    };
    reader.readAsDataURL(file);
}

function cancelFileUpload() {
    userData.file = { data: null, mime_type: null };
    filePreview.style.display = "none";
    fileInput.value = "";
}

function resetFileInput() {
    fileInput.value = "";
    filePreview.style.display = "none";
    filePreviewImg.src = "#";
    userData.file = { data: null, mime_type: null };
}
