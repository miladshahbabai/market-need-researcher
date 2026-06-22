import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const getAi = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/analyze", async (req, res) => {
    try {
      const { context } = req.body;
      const prompt = `شما یک متخصص زبده در زمینه تحقیقات بازار، علوم رفتاری و کشف نیازهای پنهان کاربران و کسب‌وکارها هستید.
وظیفه شما پیدا کردن نیازهای «روزمره، همیشگی و تکراری» است که مردم یا اینفلوئنسرها یا کسب‌وکارها با آن‌ها درگیرند و به سادگی قابل حل با یک نرم‌افزار، مینی‌اپ یا راهکار دیجیتال ساده هستند. هدف پیدا کردن ایده برای Micro-SaaS یا اپلیکیشن‌های کوچک است که بتوانند درآمدزا باشند یا زحمتی را کم کنند.

حوزه یا مخاطب مورد نظر کاربر: ${context ? context : "یک جستجوی کلی و عمیق در بازار خدمات روزمره یا اینترنتی"}

لطفا ۵ نیاز و راهکار جذاب، عملی و ساده، ولی به شدت کاربردی را پیدا کنید.
جواب باید تحت فرمت JSON برگردانده شود و شامل کلید "needs" باشد که آرایه‌ای از آبجکت‌های زیر است:
- "title": عنوان ایده (کوتاه)
- "audience": مخاطب اصلی
- "problem": مشکل دقیق و عمیق چیست؟ (درد رفتاری یا عملیاتی)
- "solution": راهکار دیجیتال پیشنهادی به ساده ترین شکل ممکن
- "whyItWorks": توضیح روانشناختی یا بازاریابی که چرا این ایده جواب می‌دهد و فروخته می‌شود.
- "difficulty": میزان سختی ساخت اپ (آسان / متوسط)`;

      const response = await getAi().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      let text = response.text || "{}";
      text = text.replace(/^```json/m, '').replace(/```$/m, '').trim();
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "خطا در دریافت اطلاعات از هوش مصنوعی: " + (error.message || "Unknown error") });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
