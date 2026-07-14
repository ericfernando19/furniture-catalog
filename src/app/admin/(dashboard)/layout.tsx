import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-[260px]">
        <AdminHeader />
        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </>
  );
}
