"use client";
import { useEffect, useState } from "react";

type Item = { file_id: string; selected?: boolean; };

export default function Page() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState<string>("");

  async function loadSet() {
    if (!name) return;
    setLoading(true);
    setItems([]);
    try {
      const r = await fetch(`/api/sticker-set?name=${encodeURIComponent(name)}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Gagal ambil sticker set");
      setItems(j.result.stickers);
      setTitle(`${j.result.title} (${j.result.count})`);
    } catch (e: any) {
      alert(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  function toggleAll(on: boolean) {
    setItems(prev => prev.map(x => ({ ...x, selected: on })));
  }

  async function downloadZip() {
    const ids = items.filter(x => x.selected).map(x => x.file_id);
    if (!ids.length) return alert("Pilih minimal 1 sticker");
    const r = await fetch("/api/zip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_ids: ids })
    });
    if (!r.ok) return alert("Gagal bikin zip");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "stickers.zip"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <h1>Telegram → WhatsApp Sticker Converter</h1>
      <p>Masukkan <b>nama sticker set Telegram</b> (contoh: <code>AnimeGirls</code>), pilih sticker, lalu unduh sebagai WebP 512×512 atau ZIP.</p>

      <div className="row">
        <input placeholder="Nama sticker set..." value={name} onChange={e => setName(e.target.value)} />
        <button className="primary" onClick={loadSet} disabled={loading}>{loading ? "Loading..." : "Load Set"}</button>
        {items.length > 0 && (
          <>
            <button onClick={() => toggleAll(true)}>Select All</button>
            <button onClick={() => toggleAll(false)}>Unselect All</button>
            <button onClick={downloadZip} className="primary">Download ZIP</button>
          </>
        )}
      </div>

      {title && <h3 style={{ marginTop: 16 }}>{title}</h3>}

      <div className="grid" style={{ marginTop: 12 }}>
        {items.map((it, i) => (
          <div className="card" key={it.file_id + i}>
            <div style={{ fontSize: 12, wordBreak: "break-all" }}>{it.file_id.slice(0, 16)}…</div>
            <img
              src={`/api/file?file_id=${encodeURIComponent(it.file_id)}`}
              alt="sticker"
              style={{ width: 96, height: 96, objectFit: "contain", display: "block", margin: "8px auto" }}
            />
            <label style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={!!it.selected}
                onChange={(e) =>
                  setItems(prev =>
                    prev.map(p => (p.file_id === it.file_id ? { ...p, selected: e.target.checked } : p))
                  )
                }
              /> pilih
            </label>
            <a
              href={`/api/file?file_id=${encodeURIComponent(it.file_id)}`}
              download={`${it.file_id}.webp`}
              style={{ display: "inline-block", marginTop: 6 }}
            >Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
