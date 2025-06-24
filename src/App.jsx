// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

import { GoogleGenAI } from "@google/genai";

import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error fetching response.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-6">Ask Gemini</h1>

      <textarea
        className="w-full max-w-2xl p-4 mb-4 rounded-lg border border-gray-700 bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
      />

      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition mb-6"
      >
        {loading ? "Loading..." : "Ask AI"}
      </button>

      <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Response:</h2>
        <p className="whitespace-pre-wrap">{response}</p>
      </div>
    </div>
  );
}

export default App;
