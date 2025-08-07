import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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

    const content = completion.choices[0].message.content.trim();
    res.status(200).json({ content });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ error: "AI Error" });
  }
}
