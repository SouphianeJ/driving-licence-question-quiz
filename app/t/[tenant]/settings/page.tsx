import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireTenantAccess } from "@/lib/server/auth";
import { getTenant, listUsers } from "@/lib/server/store";
import { Card } from "@/components/ui";
import { BrandingForm } from "@/components/BrandingForm";
import { CreateUserForm } from "@/components/CreateUserForm";
import { UserTable } from "@/components/UserTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Réglages" };

export default async function SettingsPage({ params }: { params: { tenant: string } }) {
  const tenant = await getTenant(params.tenant);
  if (!tenant) notFound();

  const me = await requireTenantAccess(params.tenant, { requireAdmin: true });
  const users = await listUsers(tenant.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Réglages</h1>
        <p className="mt-2 text-slate-600">
          Personnalisez l&apos;apparence et gérez les comptes de {tenant.name}.
        </p>
      </header>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">Personnalisation</h2>
        <p className="mt-1 text-sm text-slate-500">
          La couleur primaire recolorise automatiquement toute l&apos;interface.
        </p>
        <div className="mt-5">
          <BrandingForm tenant={tenant} />
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Nouveau compte</h2>
        <p className="mt-1 text-sm text-slate-500">
          Créez des comptes élèves ou administrateurs pour {tenant.name}.
        </p>
        <div className="mt-5">
          <CreateUserForm roles={["student", "admin"]} fixedTenantSlug={tenant.slug} />
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Comptes de l&apos;auto-école ({users.length})
        </h2>
        <UserTable users={users} currentUserId={me.id} />
      </Card>
    </div>
  );
}
