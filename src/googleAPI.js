import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
});

function getInvestmentAdvice(investorType) {
  switch (investorType) {
    case "Conservative":
      return "As a conservative investor, you should focus on capital preservation. I recommend looking into government bonds, high-quality corporate bonds, and money market funds. These options offer lower risk and stable returns.";
    case "Moderate":
      return "For a moderate investor like yourself, a balanced approach is key. I suggest a mix of equities and fixed-income securities. You might consider a portfolio with a 60/40 split between stocks and bonds to balance growth potential with risk.";
    case "Aggressive":
      return "As an aggressive investor, your goal is to maximize returns, which involves taking on more risk. I recommend a portfolio heavily weighted in stocks, including small-cap and emerging market equities. These have the potential for high growth.";
    default:
      return "Please select an investor profile to receive tailored advice.";
  }
}

async function main(prompt, investorType) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `${prompt}\n\nInvestor Profile: ${investorType}\n\n${getInvestmentAdvice(
    investorType
  )}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "There was an error generating a response from the AI.";
  }
}

export default main;
