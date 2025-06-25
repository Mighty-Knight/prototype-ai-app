import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// It is highly recommended to use environment variables for your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  // Destructure all expected fields from the request body
  const { prompt, priorities, manualContext } = req.body;

  if (!prompt || !priorities) {
    return res.status(400).send("Prompt and priorities are required.");
  }

  // Convert the priorities object into a readable string for the AI
  const prioritiesString = Object.entries(priorities)
    .map(([key, value]) => `${key} (Priority: ${value})`)
    .join(", ");

  // Conditionally create the manual context string only if it exists
  const manualContextString = manualContext
    ? `Additionally, the client has provided the following specific context: "${manualContext}".`
    : "";

  // Construct the final, detailed prompt for the AI model
  const contextualPrompt = `
        You are an expert AI Investment Advisor.
        A client has set their investment priorities using a radar chart as follows: ${prioritiesString}.
        ${manualContextString}
        Based on this specific profile and any additional context, provide a clear, concise, and helpful answer to their question: "${prompt}"
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
