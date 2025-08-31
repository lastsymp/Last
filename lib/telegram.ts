const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  // Jangan crash build, tapi beri warning via runtime
  console.warn("BOT_TOKEN belum diset. Set di Vercel env.");
}

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const FILE_API = `https://api.telegram.org/file/bot${BOT_TOKEN}`;

export type TgSticker = {
  file_id: string;
  is_animated?: boolean;
  is_video?: boolean;
  type?: string;
};

export async function getStickerSet(name: string) {
  const url = `${API}/getStickerSet?name=${encodeURIComponent(name)}`;
  const r = await fetch(url, { cache: "no-store" });
  const data = await r.json();
  if (!data.ok) throw new Error(data.description || "getStickerSet failed");
  return data.result as {
    name: string;
    title: string;
    stickers: TgSticker[];
  };
}

export async function getFilePath(file_id: string) {
  const r = await fetch(`${API}/getFile?file_id=${encodeURIComponent(file_id)}`);
  const data = await r.json();
  if (!data.ok) throw new Error(data.description || "getFile failed");
  return data.result.file_path as string;
}

export function fileUrl(file_path: string) {
  return `${FILE_API}/${file_path}`;
}
