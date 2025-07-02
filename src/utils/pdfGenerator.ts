import puppeteer from 'puppeteer';

export const generateReceiptPDF = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfUint8Array = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  });

  await browser.close();

  // ✅ Convert Uint8Array to Buffer
  return Buffer.from(pdfUint8Array);
};

