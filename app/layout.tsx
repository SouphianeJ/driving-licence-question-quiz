import type { Metadata, Viewport } from "next";
import { brand, fullTitle } from "@/config/brand";
import { paletteToCssVars } from "@/lib/color";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${fullTitle} — Interrogation orale du permis B`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  applicationName: brand.name,
};

export const viewport: Viewport = {
  themeColor: brand.primaryColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootStyle = `:root { ${paletteToCssVars(brand.primaryColor)} --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }`;

  return (
    <html lang="fr">
      <head>
        {/* Palette générée à partir de la couleur primaire de l'auto-école. */}
        <style dangerouslySetInnerHTML={{ __html: rootStyle }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
