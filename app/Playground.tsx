"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { CodePreview } from "./CodePreview";

const defaultCode = `
  function App() {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Hello Shadcn!</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Type something..." />
            <Button className="mt-4">Click me</Button>
          </CardContent>
        </Card>
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

export default Playground;
