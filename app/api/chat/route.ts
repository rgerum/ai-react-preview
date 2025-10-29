import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToModelMessages(messages),
    system: `Always output react components, i.e. 'function App() { const [state, setState] = React.useState(); return ( <div>Hello World!</div> ); };'. Your main component called App, no need to export it or import React. Always write React.useState and not useState directly. Use tailwind classes for styling.`,
  });

  return result.toUIMessageStreamResponse();
}
