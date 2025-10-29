"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Babel from "@babel/standalone";
import { createRoot } from "react-dom/client";

const defaultCode = `
  function App() {
    const [count, setCount] = React.useState(0);
    const [name, setName] = React.useState('World');

    return (
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {name}!</h1>
        <p className="text-lg text-gray-600">Count: <span className="font-semibold text-blue-600">{count}</span></p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
    );
  }
`;

const Playground = () => {
  const [code, setCode] = useState(defaultCode);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Code Editor */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc" }}>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      </div>

      {/* Preview Pane */}
      <CodePreview code={code} />
    </div>
  );
};

export function CodePreview({ code }: { code: string }) {
  const [transpiledCode, setTranspiledCode] = useState("");
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // Transpile code whenever 'code' changes
  useEffect(() => {
    try {
      setError(null);
      const output = Babel.transform(
        `
import React from 'react';

${code}
// Don't change the line below!
const root = createRoot(document.getElementById('root'));
root.render(<App />);
      `,
        {
          presets: ["react", "env"],
          plugins: [
            // Configure transform-modules-umd to treat 'react' and 'react-dom'
            // as global variables, preventing Babel from wrapping them in a .default
            [
              "transform-modules-umd",
              {
                globals: {
                  react: "React", // Map 'react' import to global 'window.React'
                  "react-dom": "ReactDOM", // Map 'react-dom' import to global 'window.ReactDOM'
                },
              },
            ],
          ],
        },
      ).code;
      setTranspiledCode(output);
    } catch (err) {
      setError(err.message);
      setTranspiledCode(""); // Clear transpiled code on error
    }
  }, [code]);

  // Expose React and ReactDOM to the window if they aren't already
  useEffect(() => {
    if (!window.React) {
      window.React = React;
    }
    if (!window.createRoot) {
      window.createRoot = createRoot;
    }
  }, []);

  // Render the transpiled code in the iframe
  useEffect(() => {
    if (!iframeRef.current || !transpiledCode) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;

    console.log(transpiledCode);

    // Basic HTML structure for the iframe
    document.open();
    document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f3f4f6;
          min-height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/javascript">
        // Polyfills or global variables if needed
        window.React = window.parent.React;
        window.createRoot = window.parent.createRoot;
        try {
          ${transpiledCode}
        } catch (e) {
          console.error("Error executing user code:", e);
          document.getElementById('root').innerHTML = '<pre style="color: red; background: white; padding: 16px; border-radius: 8px; border-left: 4px solid red;">' + e.message + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
    document.close();
  }, [transpiledCode]); // Re-render when transpiledCode changes

  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true, // Crucial for responsiveness
  };

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            zIndex: 10,
            fontFamily: "Monaco, Consolas, 'Courier New', monospace",
            fontSize: "12px",
            borderBottom: "1px solid #cc0000",
          }}
        >
          Error: {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "100%", border: "none" }}
        title="React Live Preview"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-pointer-lock allow-same-origin" // Important for security
      ></iframe>
    </div>
  );
}

export default Playground;
