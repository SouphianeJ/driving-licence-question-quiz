"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createTenantAction, type FormState } from "@/lib/server/actions";
import { SubmitButton } from "./SubmitButton";
import { FormAlert, inputClass, labelClass } from "./ui";

const initial: FormState = {};

export function CreateTenantForm() {
  const [state, action] = useFormState(createTenantAction, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state.success]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <FormAlert state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="t-name" className={labelClass}>
            Nom de l&apos;auto-école
          </label>
          <input id="t-name" name="name" required className={inputClass} placeholder="Auto-École Centrale" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="t-slug" className={labelClass}>
            Identifiant (URL)
          </label>
          <input
            id="t-slug"
            name="slug"
            required
            pattern="[a-z0-9]([a-z0-9\-]{1,38}[a-z0-9])?"
            title="Lettres minuscules, chiffres et tirets"
            className={inputClass}
            placeholder="auto-ecole-centrale"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="t-color" className={labelClass}>
          Couleur primaire
        </label>
        <input id="t-color" name="color" type="color" defaultValue="#4f46e5" className="h-10 w-16 cursor-pointer rounded-lg border border-slate-200" />
      </div>
      <SubmitButton pendingLabel="Création…">Créer le tenant</SubmitButton>
    </form>
  );
}
