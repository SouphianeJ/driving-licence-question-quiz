"use client";

import { useFormState } from "react-dom";
import { updateBrandingAction, type FormState } from "@/lib/server/actions";
import type { Tenant } from "@/lib/server/types";
import { SubmitButton } from "./SubmitButton";
import { FormAlert, inputClass, labelClass } from "./ui";

const initial: FormState = {};

export function BrandingForm({ tenant }: { tenant: Tenant }) {
  const [state, action] = useFormState(updateBrandingAction, initial);

  return (
    <form action={action} className="space-y-4">
      <FormAlert state={state} />
      <input type="hidden" name="slug" value={tenant.slug} />

      <div className="space-y-1.5">
        <label htmlFor="b-name" className={labelClass}>
          Nom de l&apos;auto-école
        </label>
        <input
          id="b-name"
          name="name"
          defaultValue={tenant.name}
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="b-color" className={labelClass}>
            Couleur primaire
          </label>
          <div className="flex items-center gap-3">
            <input
              id="b-color"
              name="color"
              type="color"
              defaultValue={tenant.color}
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-200"
            />
            <span className="text-sm text-slate-500">{tenant.color}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="b-logo" className={labelClass}>
            URL du logo (optionnel)
          </label>
          <input
            id="b-logo"
            name="logoUrl"
            type="url"
            defaultValue={tenant.logoUrl}
            className={inputClass}
            placeholder="https://…/logo.png"
          />
        </div>
      </div>

      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}
