import React, { useState } from "react";
import RadarSelector from "./RadarSelector"; // Import the new component

function App() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priorities, setPriorities] = useState({
    "Traded Funds": 2,
    Bonds: 4,
    Equities: 3,
    "Mutual Funds": 1,
  });

  const handleClick = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);

    const userMessage = { role: "user", content: prompt };
    setHistory((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, priorities }),
      });

      const data = await res.json();
      const aiMessage = { role: "ai", content: data.result };
      setHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        role: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex justify-center items-center font-sans">
      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">AI Investment Assistant</h1>
          <p className="text-gray-600 mt-1">
            Set your investment priorities and ask for advice
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Radar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">Investment Types</h2>
            <RadarSelector
              priorities={priorities}
              setPriorities={setPriorities}
            />
          </div>

          {/* Right Column: Chat */}
          <div className="flex flex-col bg-gray-50 rounded-lg p-4 h-[60vh]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`inline-block max-w-sm px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content || "..."}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left text-gray-500 animate-pulse">
                  AI is thinking...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && handleClick()
                }
                placeholder="Ask for advice..."
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2 rounded-lg transition-colors font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
