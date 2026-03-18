import { Router, Request, Response } from "express";
import { generatePdf } from "../services/generatePdf";
import { BlobServiceClient } from "@azure/storage-blob";

const router = Router();

async function uploadToAxxisOland(buffer: Buffer, fileName: string, contentType: string) {
  const connectionString = process.env.AXXIS_OLAND_AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AXXIS_OLAND_AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("Missing AXXIS_OLAND_AZURE_STORAGE_CONNECTION_STRING environment variable");
  }

  if (!containerName) {
    throw new Error("Missing AXXIS_OLAND_AZURE_STORAGE_CONTAINER_NAME environment variable");
  }

  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobService.getContainerClient(containerName);

  await containerClient.createIfNotExists({ access: "container" });

  const blockBlob = containerClient.getBlockBlobClient(fileName);

  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlob.url;
}

router.post("/api/axxis-oland-tyc-pdf", async (req: Request, res: Response) => {
  try {
    const { html, options, fileName: customFileName } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    const pdfBuffer = await generatePdf(html, options);
    const fileName = customFileName ?? `pdf-${Date.now()}.pdf`;
    const url = await uploadToAxxisOland(pdfBuffer, fileName, "application/pdf");

    return res.json({ success: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation error" });
  }
});

export default router;
