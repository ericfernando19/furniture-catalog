"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
      <Input
        id="username"
        name="username"
        label="Username"
        placeholder="admin"
        error={state?.error && !isPending ? state.error : undefined}
      />
      <Input
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
