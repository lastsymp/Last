export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getStickerSet } from "@/lib/telegram";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });

    const set = await getStickerSet(name);
    // filter statis saja (bukan animated/video) untuk fase awal
    const stickers = (set.stickers || []).filter(s => !s.is_animated && !s.is_video);

    return NextResponse.json({
      ok: true,
      result: {
        name: set.name,
        title: set.title,
        count: stickers.length,
        stickers: stickers.map(s => ({ file_id: s.file_id }))
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "internal error" }, { status: 500 });
  }
}
