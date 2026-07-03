import type { Metadata, Viewport } from "next";
import { product } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${product.name} — Interrogation orale du permis B`,
    template: `%s · ${product.name}`,
  },
  description: product.tagline,
  applicationName: product.name,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const FONT_VARS =
  ':root { --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: FONT_VARS }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
