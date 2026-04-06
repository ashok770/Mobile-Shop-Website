import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      console.log("Response:", res.data);

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Frontend Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error talking to server" },
      ]);
    }

    setInput("");
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <div style={{ height: "300px", overflowY: "scroll" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <b>{msg.sender}:</b> {msg.text}
              </div>
            ))}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
