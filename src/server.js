// server.js
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyAJOmYivE04GtQUOY8ARs1uClvpOiF11VY");

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ result: response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).send("API Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
