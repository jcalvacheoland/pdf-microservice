import "dotenv/config";
import express from "express";
import { authMiddleware } from "./shared/authMiddleware";
import pdfGeneratorApi from "./routes/pdfGeneratorApi";
import htmlToIMGGeneratorApi from "./routes/htmlToIMGGeneratorApi";
import axxisOlandApi from "./routes/axxisOlandApi";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(authMiddleware);

app.use(pdfGeneratorApi);
app.use(htmlToIMGGeneratorApi);
app.use(axxisOlandApi);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
