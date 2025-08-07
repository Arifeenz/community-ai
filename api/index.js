const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ ตรวจสอบว่า KEY ถูกโหลดจริง
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in environment variables");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      console.error("❌ Missing prompt");
      return res.status(400).json({ error: "Missing prompt" });
    }

    console.log("📩 Prompt received:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // หรือ gpt-3.5-turbo
      messages: [
        {
          role: "system",
          content:
            "คุณคือผู้ช่วยที่ช่วยเขียนโพสต์แนะนำกิจกรรมของชุมชนให้ดูน่าสนใจและเป็นธรรมชาติ",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const aiContent = completion.choices[0].message.content.trim();
    res.json({ content: aiContent });
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ error: err.message || "AI Error" });
  }
});

// ✅ Only start server if running locally (Vercel ไม่ใช้ app.listen)
if (process.env.NODE_ENV !== "production") {
  app.listen(3001, () => {
    console.log("✅ Backend is running at http://localhost:3001");
  });
}

// ✅ Export handler สำหรับ Vercel
module.exports = app;
