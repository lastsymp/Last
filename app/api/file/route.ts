export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getFilePath, fileUrl } from "@/lib/telegram";
import { toStickerWebp512 } from "@/lib/image";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const file_id = searchParams.get("file_id");
    if (!file_id) return new NextResponse("file_id required", { status: 400 });

    const file_path = await getFilePath(file_id);
    const url = fileUrl(file_path);

    const raw = await fetch(url, { cache: "no-store" });
    if (!raw.ok) return new NextResponse("download failed", { status: 502 });

    const input = await raw.arrayBuffer();
    const webp = await toStickerWebp512(input);

    return new NextResponse(webp, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="${file_id}.webp"`
      }
    });
  } catch (e: any) {
    return new NextResponse(e?.message || "internal error", { status: 500 });
  }
}
