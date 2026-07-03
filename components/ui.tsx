import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { THEME_LABELS, type Theme, type VerificationPosition } from "@/lib/types";
import { CarIcon, HeartPulseIcon, ShieldIcon } from "./icons";

/** Concatène des classes en ignorant les valeurs falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const buttonBase =
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonBase, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonBase, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

const THEME_STYLES: Record<
  Theme,
  { label: string; icon: typeof CarIcon; badge: string }
> = {
  verification: {
    label: THEME_LABELS.verification,
    icon: CarIcon,
    badge: "bg-brand-50 text-brand-700 border-brand-200",
  },
  securite: {
    label: THEME_LABELS.securite,
    icon: ShieldIcon,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  premiers_secours: {
    label: THEME_LABELS.premiers_secours,
    icon: HeartPulseIcon,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function ThemeBadge({ theme }: { theme: Theme }) {
  const { label, icon: Icon, badge } = THEME_STYLES[theme];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        badge
      )}
    >
      <Icon width={14} height={14} />
      {label}
    </span>
  );
}

export function PositionBadge({ position }: { position: VerificationPosition }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      {position}
    </span>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400";

export const labelClass = "block text-sm font-medium text-slate-700";

export function FormAlert({ state }: { state: { error?: string; success?: string } }) {
  if (state.error) {
    return (
      <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
        {state.success}
      </p>
    );
  }
  return null;
}

export function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-brand-600 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
