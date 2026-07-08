export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#1A120B]">
      {children}
    </div>
  );
}
