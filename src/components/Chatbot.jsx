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

      const botMsg =
        res.data.type === "products"
          ? { sender: "bot", type: "products", products: res.data.products }
          : { sender: "bot", text: res.data.reply };
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
              <div key={i} style={{ marginBottom: "10px" }}>
                {msg.sender === "user" ? (
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        background: "#007bff",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ) : msg.type === "products" ? (
                  <div>
                    {msg.products.map((p, index) => (
                      <div
                        key={index}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          marginBottom: "5px",
                          borderRadius: "8px",
                        }}
                      >
                        <div>
                          <b>{p.name}</b>
                        </div>
                        <div>₹{p.price}</div>
                        <a href={p.link} target="_blank" rel="noreferrer">
                          🔗 View Product
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "left" }}>
                    <span
                      style={{
                        background: "#eee",
                        padding: "5px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                )}
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
