import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/server/auth";
import { listTenants, listUsers } from "@/lib/server/store";
import { GlobalHeader } from "@/components/GlobalHeader";
import { AppFooter } from "@/components/AppFooter";
import { Card } from "@/components/ui";
import { CreateTenantForm } from "@/components/CreateTenantForm";
import { CreateUserForm } from "@/components/CreateUserForm";
import { UserTable } from "@/components/UserTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Console superadmin" };

export default function AdminPage() {
  const me = requireRole("superadmin", "/admin");
  const tenants = listTenants();
  const users = listUsers();

  return (
    <>
      <GlobalHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Console superadmin</h1>
          <p className="mt-2 text-slate-600">
            Gérez les auto-écoles (tenants) et les comptes de la plateforme.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Nouvelle auto-école
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crée un tenant accessible sur <code>/t/identifiant</code>.
            </p>
            <div className="mt-5">
              <CreateTenantForm />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Nouveau compte</h2>
            <p className="mt-1 text-sm text-slate-500">
              Créez un administrateur d&apos;auto-école, un élève ou un superadmin.
            </p>
            <div className="mt-5">
              <CreateUserForm
                roles={["admin", "student", "superadmin"]}
                tenants={tenants}
              />
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Auto-écoles ({tenants.length})
            </h2>
          </div>
          {tenants.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">Aucune auto-école.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <li key={t.slug} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3">
                    <span
                      className="h-6 w-6 rounded-md border border-slate-200"
                      style={{ backgroundColor: t.color }}
                      aria-hidden
                    />
                    <span>
                      <span className="font-medium text-slate-800">{t.name}</span>
                      <span className="ml-2 text-sm text-slate-400">/t/{t.slug}</span>
                    </span>
                  </span>
                  <Link
                    href={`/t/${t.slug}/settings`}
                    className="text-sm font-medium text-brand-700 hover:underline"
                  >
                    Réglages →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Tous les comptes ({users.length})
          </h2>
          <UserTable users={users} currentUserId={me.id} showTenant />
        </Card>
      </main>
      <AppFooter />
    </>
  );
}
