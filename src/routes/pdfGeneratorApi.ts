import { Router, Request, Response } from "express";
import { generatePdf } from "../services/generatePdf";
import { uploadToAzure } from "../shared/uploadToAzure";

const router = Router();

router.post("/api/pdf", async (req: Request, res: Response) => {
  try {
    const { html, options } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    const pdfBuffer = await generatePdf(html, options);
    const fileName = `pdf-${Date.now()}.pdf`;
    const url = await uploadToAzure(pdfBuffer, fileName, "application/pdf");

    return res.json({
      success: true,
      url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation error" });
  }
});

export default router;
