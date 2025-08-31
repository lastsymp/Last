export const metadata = {
  title: "TG→WA Sticker Converter",
  description: "Convert Telegram stickers to WhatsApp-ready WebP 512x512",
  manifest: "/app/manifest.webmanifest",
  themeColor: "#0ea5e9"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head />
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
