import sharp from "sharp";

export async function toStickerWebp512(input: ArrayBuffer) {
  // Telegram statis umumnya sudah .webp, tapi kita pastikan ukuran & kompresi konsisten
  const buf = Buffer.from(input);
  const img = sharp(buf, { failOnError: false }).resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }).webp({ quality: 80, effort: 4 });

  return await img.toBuffer();
}
