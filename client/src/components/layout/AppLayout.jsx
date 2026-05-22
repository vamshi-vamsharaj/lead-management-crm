import { useState, createContext, useContext } from "react";
import { DesktopSidebar, MobileSidebar } from "./Sidebar";
import TopBar from "./TopBar";

export const AddLeadContext = createContext(null);

export const useAddLeadSheet = () => useContext(AddLeadContext);

export default function AppLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [addLeadSheetOpen, setAddLeadSheetOpen] = useState(false);

  return (
    <AddLeadContext.Provider
      value={{
        open: addLeadSheetOpen,
        setOpen: setAddLeadSheetOpen,
      }}
    >
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Mobile Sidebar */}
        <MobileSidebar
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main */}
        <div className="lg:pl-56 flex flex-col min-h-screen">
          <TopBar
            onMenuClick={() => setMobileSidebarOpen(true)}
            onAddLead={() => setAddLeadSheetOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 px-4 lg:px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </AddLeadContext.Provider>
  );
}