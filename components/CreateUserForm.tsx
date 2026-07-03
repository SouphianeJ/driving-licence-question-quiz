"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createUserAction, type FormState } from "@/lib/server/actions";
import { ROLE_LABELS, type Role } from "@/lib/server/types";
import { SubmitButton } from "./SubmitButton";
import { FormAlert, inputClass, labelClass } from "./ui";

const initial: FormState = {};

interface CreateUserFormProps {
  /** Rôles sélectionnables. */
  roles: Role[];
  /** Tenant imposé (cas de l'admin) ; masque le sélecteur de tenant. */
  fixedTenantSlug?: string;
  /** Liste des tenants (cas du superadmin). */
  tenants?: Array<{ slug: string; name: string }>;
}

export function CreateUserForm({ roles, fixedTenantSlug, tenants }: CreateUserFormProps) {
  const [state, action] = useFormState(createUserAction, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state.success]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <FormAlert state={state} />
      {fixedTenantSlug && <input type="hidden" name="tenantSlug" value={fixedTenantSlug} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="u-email" className={labelClass}>
            Adresse e-mail
          </label>
          <input id="u-email" name="email" type="email" required className={inputClass} placeholder="eleve@auto-ecole.fr" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="u-password" className={labelClass}>
            Mot de passe provisoire
          </label>
          <input id="u-password" name="password" type="text" required minLength={6} className={inputClass} placeholder="6 caractères minimum" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="u-role" className={labelClass}>
            Rôle
          </label>
          <select id="u-role" name="role" defaultValue={roles[0]} className={inputClass}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {!fixedTenantSlug && tenants && (
          <div className="space-y-1.5">
            <label htmlFor="u-tenant" className={labelClass}>
              Tenant
            </label>
            <select id="u-tenant" name="tenantSlug" className={inputClass} defaultValue="">
              <option value="">— Aucun (superadmin) —</option>
              {tenants.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <SubmitButton pendingLabel="Création…">Créer le compte</SubmitButton>
    </form>
  );
}
