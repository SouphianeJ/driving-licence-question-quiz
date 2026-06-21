import { ROLE_LABELS, type User } from "@/lib/server/types";
import { DeleteUserForm } from "./DeleteUserForm";

const ROLE_BADGE: Record<User["role"], string> = {
  superadmin: "bg-purple-50 text-purple-700",
  admin: "bg-brand-50 text-brand-700",
  student: "bg-slate-100 text-slate-600",
};

export function UserTable({
  users,
  currentUserId,
  showTenant = false,
}: {
  users: User[];
  currentUserId: string;
  showTenant?: boolean;
}) {
  if (users.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">Aucun compte.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
            <th className="py-2 pr-4 font-medium">E-mail</th>
            <th className="py-2 pr-4 font-medium">Rôle</th>
            {showTenant && <th className="py-2 pr-4 font-medium">Tenant</th>}
            <th className="py-2 pr-4 font-medium">Créé le</th>
            <th className="py-2 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="py-3 pr-4 font-medium text-slate-800">{u.email}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
              </td>
              {showTenant && (
                <td className="py-3 pr-4 text-slate-500">{u.tenantSlug ?? "—"}</td>
              )}
              <td className="py-3 pr-4 text-slate-500">
                {new Date(u.createdAt).toLocaleDateString("fr-FR")}
              </td>
              <td className="py-3 text-right">
                <div className="flex justify-end">
                  <DeleteUserForm
                    userId={u.id}
                    email={u.email}
                    disabled={u.id === currentUserId}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
