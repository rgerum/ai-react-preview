"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { CodePreview } from "../CodePreview";

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
      {/*null &&
        messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <span key={index}>{part.text}</span>
              ) : null,
            )}
          </div>
          ))*/}

      <div className="flex h-[calc(100vh-100px)] mb-[100px]">
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
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 flex gap-3 items-center shadow-lg"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Ask AI to create or modify React components..."
          className={`flex-1 px-4 py-3 border border-gray-300 rounded-full outline-none text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
            status !== "ready" ? "bg-gray-50" : "bg-white shadow-sm"
          }`}
        />
        <button
          type="submit"
          disabled={status !== "ready"}
          className={`px-6 py-3 text-white border-none rounded-full font-semibold text-sm transition-all duration-200 ${
            status !== "ready"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 cursor-pointer hover:bg-blue-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          }`}
        >
          {status === "loading" ? "Sending..." : "Send"}
        </button>
      </form>
    </>
  );
}
