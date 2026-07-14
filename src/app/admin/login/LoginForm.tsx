"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/validations";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Login gagal");
      return;
    }

    toast.success("Login berhasil!");
    router.push("/admin/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="username"
        label="Username"
        placeholder="admin"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
