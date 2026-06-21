"use client";

import { useFormState } from "react-dom";
import { loginAction, type FormState } from "@/lib/server/actions";
import { SubmitButton } from "./SubmitButton";
import { FormAlert, inputClass, labelClass } from "./ui";

const initial: FormState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <FormAlert state={state} />
      {next && <input type="hidden" name="next" value={next} />}

      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="vous@auto-ecole.fr"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <SubmitButton className="w-full" pendingLabel="Connexion…">
        Se connecter
      </SubmitButton>
    </form>
  );
}
