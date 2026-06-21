import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { requireTenantAccess } from "@/lib/server/auth";
import { getTenant } from "@/lib/server/store";
import { toPublicUser } from "@/lib/server/types";
import { buildPalette } from "@/lib/color";
import { TenantHeader } from "@/components/TenantHeader";
import { AppFooter } from "@/components/AppFooter";

export const dynamic = "force-dynamic";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const tenant = await getTenant(params.tenant);
  if (!tenant) notFound();

  const user = await requireTenantAccess(params.tenant);

  // Palette injectée localement pour ce tenant (recolorise toute l'interface).
  const palette = buildPalette(tenant.color);
  const style = Object.fromEntries(
    Object.entries(palette).map(([stop, rgb]) => [`--brand-${stop}`, rgb])
  ) as CSSProperties;

  return (
    <div style={style} className="flex flex-1 flex-col">
      <TenantHeader
        slug={tenant.slug}
        name={tenant.name}
        logoUrl={tenant.logoUrl}
        user={toPublicUser(user)}
      />
      <main className="flex-1">{children}</main>
      <AppFooter name={tenant.name} />
    </div>
  );
}
