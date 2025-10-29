"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { CodePreview } from "../Playground";

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");

  let code = "function App() {\n  return <div>Hello World</div>;\n}";
  if (messages.length > 0) {
    console.log(messages);
    let found = false;
    for (let j = messages.length - 1; j >= 0; j--) {
      const message = messages[j];
      for (let i = 0; i < message.parts.length; i++) {
        const part = message.parts[i];
        if (part.type === "text") {
          const content = part.text;
          if (
            (content.startsWith("```jsx") || content.startsWith("```tsx")) &&
            content.endsWith("```")
          ) {
            code = content.substring(6, content.length - 3);
            found = true;
            break;
          }
        }
        console.log(code);
      }
      if (found) break;
      console.log(code);
    }
  }

  return (
    <>
      {null &&
        messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <span key={index}>{part.text}</span>
              ) : null,
            )}
          </div>
        ))}

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 100px)",
          marginBottom: "100px",
        }}
      >
        <CodePreview code={code} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTop: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Ask AI to create or modify React components..."
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "24px",
            outline: "none",
            fontSize: "14px",
            backgroundColor: status !== "ready" ? "#f9fafb" : "white",
            transition: "all 0.2s ease",
            boxShadow:
              status !== "ready" ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          }}
        />
        <button
          type="submit"
          disabled={status !== "ready"}
          style={{
            padding: "12px 24px",
            backgroundColor: status !== "ready" ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "24px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: status !== "ready" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow:
              status !== "ready" ? "none" : "0 2px 4px rgba(59, 130, 246, 0.2)",
          }}
          onMouseEnter={(e) => {
            if (status === "ready") {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (status === "ready") {
              e.target.style.backgroundColor = "#3b82f6";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>
      </form>
    </>
  );
}
