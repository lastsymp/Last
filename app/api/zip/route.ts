export const runtime = "nodejs";

import { NextResponse } from "next/server";
// relative import (FIX)
import { getFilePath, fileUrl } from "../../../lib/telegram";
import { toStickerWebp512 } from "../../../lib/image";
import JSZip from "jszip";

type Body = { file_ids: string[] };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const ids = Array.from(new Set(body?.file_ids || [])).slice(0, 60);
    if (!ids.length) return NextResponse.json({ ok: false, error: "file_ids required" }, { status: 400 });

    const zip = new JSZip();
    let idx = 1;

    for (const file_id of ids) {
      try {
        const file_path = await getFilePath(file_id);
        const url = fileUrl(file_path);
        const raw = await fetch(url, { cache: "no-store" });
        if (!raw.ok) continue;
        const input = await raw.arrayBuffer();
        const webp = await toStickerWebp512(input);
        zip.file(`${idx.toString().padStart(2, "0")}-${file_id}.webp`, webp);
        idx++;
      } catch {
        // skip individual failure
      }
    }

    const out = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
    return new NextResponse(out, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="stickers.zip"`
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "internal error" }, { status: 500 });
  }
}
