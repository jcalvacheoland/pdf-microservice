import "dotenv/config";
import express, { Request, Response } from "express";
import { generatePdf } from "./generatePdf";
import { uploadPdfToAzure } from "./uploadToAzure";

const app = express();
app.use(express.json({ limit: "10mb" }));



app.post("/api/pdf", async (req: Request, res: Response) => {
  try {
    const { html, options } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    // 1. Generar el PDF en memoria (Buffer)
    const pdfBuffer = await generatePdf(html, options);

    // 2. Crear nombre único del archivo
    const fileName = `pdf-${Date.now()}.pdf`;

    // 3. Subir a Azure
    const url = await uploadPdfToAzure(pdfBuffer, fileName);

    // 4. Retornar solo la URL
    return res.json({
      success: true,
      url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
