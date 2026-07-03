"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Button>, "type"> & { pendingLabel?: string };

export function SubmitButton({ children, pendingLabel, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel ?? "Veuillez patienter…" : children}
    </Button>
  );
}
