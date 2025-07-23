import React, { useState } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ChatbotBubble = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your studies." },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Prepare prompt for Gemini
      const prompt = input;

      // Call Gemini API directly
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateText?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: {
              text: prompt,
            },
            temperature: 0.7,
            maxOutputTokens: 256,
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      // Extract the text output
      const botReply =
        data?.candidates?.[0]?.output || 
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-[#1E1E1E] rounded-xl shadow-lg flex flex-col p-4 z-50 font-poppins text-white">
          <div className="flex-grow overflow-y-auto mb-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  msg.from === "bot"
                    ? "bg-[#A46BEC] self-start"
                    : "bg-[#7a3ed6] self-end text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[80%] px-3 py-2 rounded-lg bg-[#A46BEC] self-start italic">
                Typing...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-grow rounded-md px-3 py-2 text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-[#A46BEC] px-4 rounded-md font-semibold hover:bg-white hover:text-[#A46BEC] transition disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#A46BEC] hover:bg-[#7a3ed6] text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center font-bold text-2xl z-50 select-none"
        aria-label="Toggle chatbot"
        title="Chat with EduSpark Bot"
      >
        💬
      </button>
    </>
  );
};

export default ChatbotBubble;
