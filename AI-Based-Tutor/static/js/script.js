// script.js

// Sample responses based on simple keywords or topics (can be extended)
const responses = {
  math: "Math is all about patterns, numbers, and logic! Do you want help with algebra, geometry, or calculus?",
  science: "Science helps us understand the world! Are you curious about physics, chemistry, or biology?",
  history: "History tells us the story of the past. Want to explore ancient civilizations or modern events?",
  literature: "Literature dives into storytelling and expression. Want help analyzing a poem or a novel?",
  default: "That's interesting! Tell me more so I can assist you better.",
  algebra: "Algebra is about using symbols and letters to represent numbers in equations. For example, x + 3 = 5.",
};

// Send user message and get AI reply
function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (message === '') return;

  appendMessage(message, 'user');
  input.value = '';

  setTimeout(async () => {
    const reply = await generateAIResponse(message);
    appendMessage(reply, 'ai');
  }, 500);
}

// Add a message to the chat
function appendMessage(text, sender) {
  const chat = document.getElementById('chat');
  const msg = document.createElement('div');
  msg.className = `chat-box ${sender === 'user' ? 'user' : ''}`;
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Get AI response from backend
async function generateAIResponse(message) {
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply || responses.default;
  } catch (error) {
    console.error("Error talking to AI:", error);
    return "Oops! Something went wrong connecting to the AI.";
  }
}

// When page is ready
document.addEventListener("DOMContentLoaded", () => {
  // Enter key sends message
  document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Click send button
  document.getElementById("sendBtn").addEventListener("click", sendMessage);

  // Subject click behavior
  document.querySelectorAll(".sidebar ul li").forEach((item) => {
    item.addEventListener("click", async () => {
      const subject = item.textContent.toLowerCase();
      const message = `Tell me about ${subject}`;
      appendMessage(message, 'user');

      const reply = await generateAIResponse(subject);
      appendMessage(reply, 'ai');
    });
  });
});
