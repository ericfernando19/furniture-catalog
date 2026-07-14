import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
            <span className="text-base font-bold text-white">K</span>
          </div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Katalog Toko
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Masuk ke dashboard admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
