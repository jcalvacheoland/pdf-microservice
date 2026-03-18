import { Router, Request, Response } from "express";
import { generateImg } from "../services/generateImg";
import { uploadToAzure } from "../shared/uploadToAzure";

const router = Router();

router.post("/api/html-to-img", async (req: Request, res: Response) => {
  try {
    const { html, options } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    const imgBuffer = await generateImg(html, options);
    const fileName = `img-${Date.now()}.png`;
    const url = await uploadToAzure(imgBuffer, fileName, "image/png");

    return res.json({
      success: true,
      url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation error" });
  }
});

export default router;
