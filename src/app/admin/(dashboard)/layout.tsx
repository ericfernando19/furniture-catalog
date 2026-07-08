import { Sidebar } from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-64">
        <div className="container-premium py-8 sm:py-10">
          {children}
        </div>
      </div>
    </>
  );
}
