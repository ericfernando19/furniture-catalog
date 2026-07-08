import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] dark:bg-[#1A120B]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-[#2C1810]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#3E2723] dark:text-[#F5EDE0]">
            Admin<span className="text-[#8B6914]">Panel</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Masuk ke dashboard admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
