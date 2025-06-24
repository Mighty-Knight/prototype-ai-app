import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// It is highly recommended to use environment variables for your API key
const genAI = new GoogleGenerativeAI("AIzaSyAJOmYivE04GtQUOY8ARs1uClvpOiF11VY");

app.post("/generate", async (req, res) => {
  const { prompt, priorities } = req.body;

  if (!prompt || !priorities) {
    return res.status(400).send("Prompt and priorities are required.");
  }

  // Construct a detailed contextual prompt for the AI
  const prioritiesString = Object.entries(priorities)
    .map(([key, value]) => `${key} (Priority: ${value})`)
    .join(", ");

  const contextualPrompt = `
        You are an expert AI Investment Advisor.
        A client has set their investment priorities as follows: ${prioritiesString}.
        Based on this specific profile, provide a clear and concise answer to their question: "${prompt}"
    `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;

    res.json({ result: response.text() });
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    res.status(500).send("An error occurred while communicating with the AI.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
