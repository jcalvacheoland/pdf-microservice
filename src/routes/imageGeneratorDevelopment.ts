import { Router, Request, Response } from "express";
import { generateImg } from "../services/generateImg";
import { BlobServiceClient } from "@azure/storage-blob";

const router = Router();

async function uploadToPruebas(buffer: Buffer, fileName: string, contentType: string) {
  const connectionString = process.env.AXXIS_OLAND_AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.OLAND_AZURE_STORAGE_PRUEBAS;

  if (!connectionString) {
    throw new Error("Missing AXXIS_OLAND_AZURE_STORAGE_CONNECTION_STRING environment variable");
  }

  if (!containerName) {
    throw new Error("Missing OLAND_AZURE_STORAGE_PRUEBAS environment variable");
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

router.post("/api/image-generator-development", async (req: Request, res: Response) => {
  try {
    const { html, options } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    const imgBuffer = await generateImg(html, options);
    const fileName = `img-${Date.now()}.png`;
    const url = await uploadToPruebas(imgBuffer, fileName, "image/png");

    return res.json({ success: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation error" });
  }
});

export default router;
