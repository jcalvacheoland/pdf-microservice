import playwright from "playwright";

export async function generateImg(html: string, options: any = {}) {
  const browser = await playwright.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });

  const imgBuffer = await page.screenshot({
    fullPage: true,
    type: "png",
    ...options
  });

  await browser.close();
  return Buffer.from(imgBuffer);
}
