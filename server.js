import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;

// ✅ POST route for chatbot messages
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    // ✅ Defensive check for missing data
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "Invalid response from Groq API" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Health check route (optional)
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Required for Vercel
export default app;
