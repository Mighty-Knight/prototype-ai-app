// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import { useState } from "react";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleClick = async () => {
//     if (!prompt.trim()) return;

//     setLoading(true);
//     setResponse("");

//     try {
//       const res = await fetch("http://localhost:3001/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await res.json();
//       setResponse(data.result);
//     } catch (error) {
//       console.error("Error:", error);
//       setResponse("Error fetching response.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-8">
//       <h1 className="text-3xl font-bold mb-6">Ask Gemini</h1>

//       <textarea
//         className="w-full max-w-2xl p-4 mb-4 rounded-lg border border-gray-700 bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//         rows={4}
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Type your prompt here..."
//       />

//       <button
//         onClick={handleClick}
//         disabled={loading}
//         className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition mb-6"
//       >
//         {loading ? "Loading..." : "Ask AI"}
//       </button>

//       <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg border border-gray-700">
//         <h2 className="text-lg font-semibold mb-2">Response:</h2>
//         <p className="whitespace-pre-wrap">{response}</p>
//       </div>
//     </div>
//   );
// }

function App() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    const userMessage = { role: "user", content: prompt };
    const systemMessage = context ? { role: "system", content: context } : null;

    const messages = systemMessage
      ? [systemMessage, ...history, userMessage]
      : [...history, userMessage];

    try {
      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
        }),
      });

      const data = await res.json();

      const aiMessage = { role: "ai", content: data.result };

      setHistory([...messages, aiMessage]);
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Chat with Gemini</h1>

      <div className="w-full max-w-3xl mb-4">
        <textarea
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white mb-2"
          rows={2}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Add custom AI context (optional, e.g., 'You are a friendly teacher')"
        />
      </div>

      <div className="w-full max-w-3xl mb-4 overflow-y-auto h-[400px] bg-gray-800 p-4 rounded-lg border border-gray-700">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-green-300"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left animate-pulse text-gray-400">
            Gemini is thinking...
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl flex gap-2">
        <input
          className="flex-grow p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          placeholder="Ask something..."
        />
        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
