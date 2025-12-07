import playwright from "playwright";

export async function generatePdf(html: string, options: any = {}) {
  const browser = await playwright.chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.emulateMedia({ media: "screen" });
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    ...options
  });

  await browser.close();
  return pdfBuffer;
}
