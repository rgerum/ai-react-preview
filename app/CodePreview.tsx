"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Babel from "@babel/standalone";
import { createRoot } from "react-dom/client";

// Import Shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Create Shadcn components object to expose globally
const ShadcnComponents = {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  Input,
  cn,
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
                  // Shadcn components are available as global variables
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

  // Expose React, ReactDOM, and Shadcn components to the window if they aren't already
  useEffect(() => {
    if (!window.React) {
      window.React = React;
    }
    if (!window.createRoot) {
      window.createRoot = createRoot;
    }
    // Make Shadcn components available globally
    if (!window.ShadcnUI) {
      window.ShadcnUI = ShadcnComponents;
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
        /* Shadcn/ui CSS Custom Properties */
        :root {
          --radius: 0.625rem;
          --background: 0 0% 100%;
          --foreground: 0 0% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 3.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 0 0% 3.9%;
          --primary: 0 0% 9%;
          --primary-foreground: 0 0% 98%;
          --secondary: 0 0% 96.1%;
          --secondary-foreground: 0 0% 9%;
          --muted: 0 0% 96.1%;
          --muted-foreground: 0 0% 45.1%;
          --accent: 0 0% 96.1%;
          --accent-foreground: 0 0% 9%;
          --destructive: 0 84.2% 60.2%;
          --border: 0 0% 89.8%;
          --input: 0 0% 89.8%;
          --ring: 0 0% 3.9%;
        }

        .dark {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
          --card: 0 0% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 0 0% 9%;
          --secondary: 0 0% 14.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 0 0% 14.9%;
          --muted-foreground: 0 0% 63.9%;
          --accent: 0 0% 14.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --border: 0 0% 14.9%;
          --input: 0 0% 14.9%;
          --ring: 0 0% 83.1%;
        }

        body {
          font-family: system-ui, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          min-height: 100vh;
        }

        /* Shadcn component styles */
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .bg-secondary { background-color: hsl(var(--secondary)); }
        .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
        .bg-muted { background-color: hsl(var(--muted)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-accent { background-color: hsl(var(--accent)); }
        .text-accent-foreground { color: hsl(var(--accent-foreground)); }
        .bg-destructive { background-color: hsl(var(--destructive)); }
        .border-border { border-color: hsl(var(--border)); }
        .border-input { border-color: hsl(var(--input)); }

        /* Focus ring utilities */
        .focus-visible\\:ring-ring:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px hsl(var(--ring));
        }

        .focus-visible\\:ring-ring\\/50:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.5);
        }

      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/javascript">
        // Clear any existing components to prevent redeclaration
        delete window.Button;
        delete window.Card;
        delete window.CardHeader;
        delete window.CardTitle;
        delete window.CardDescription;
        delete window.CardContent;
        delete window.CardFooter;
        delete window.CardAction;
        delete window.Input;
        delete window.cn;

        // Polyfills or global variables if needed
        window.React = window.parent.React;
        window.createRoot = window.parent.createRoot;

        // Make Shadcn components available globally (dynamic assignment)
        if (window.parent.ShadcnUI) {
          Object.keys(window.parent.ShadcnUI).forEach(key => {
            window[key] = window.parent.ShadcnUI[key];
          });
        }

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
