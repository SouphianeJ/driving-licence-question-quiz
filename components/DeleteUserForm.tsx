"use client";

import { useFormState } from "react-dom";
import { deleteUserAction, type FormState } from "@/lib/server/actions";

const initial: FormState = {};

export function DeleteUserForm({
  userId,
  email,
  disabled,
}: {
  userId: string;
  email: string;
  disabled?: boolean;
}) {
  const [, action] = useFormState(deleteUserAction, initial);

  if (disabled) {
    return <span className="text-xs text-slate-400">vous</span>;
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Supprimer le compte ${email} ?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
      >
        Supprimer
      </button>
    </form>
  );
}
