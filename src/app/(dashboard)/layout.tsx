import MinimalSidebar from "@/components/MinimalSidebar";
import MinimalTopbar from "@/components/MinimalTopbar";
import QuickAddButton from "@/components/QuickAddButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* Sidebar */}
      <MinimalSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-20 flex flex-col">
        {/* Topbar */}
        <MinimalTopbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Add Button */}
      <QuickAddButton />
    </div>
  );
}
