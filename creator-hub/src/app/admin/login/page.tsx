import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata = { title: "Admin · Creator Club" };

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="card">
          <h1 className="mb-1 text-xl font-bold">Área administrativa</h1>
          <p className="mb-5 text-sm text-[var(--muted)]">
            Acesso restrito à equipe Botanika.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
