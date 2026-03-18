import "dotenv/config";
import { BlobServiceClient } from "@azure/storage-blob";

export async function uploadToAzure(buffer: Buffer, fileName: string, contentType: string) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING environment variable");
  }

  if (!containerName) {
    throw new Error("Missing AZURE_STORAGE_CONTAINER_NAME environment variable");
  }

  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobService.getContainerClient(containerName);

  // Crea el contenedor si no existe
  await containerClient.createIfNotExists({
    access: "container",
  });

  const blockBlob = containerClient.getBlockBlobClient(fileName);

  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  });

  return blockBlob.url;
}
