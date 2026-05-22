
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar, MobileSidebar } from './Sidebar'
import TopBar from './TopBar'

// This context lets any child open the Add Lead sheet
// without prop-drilling through page → table → button
import { createContext, useContext } from 'react'
export const AddLeadContext = createContext(null)
export const useAddLeadSheet = () => useContext(AddLeadContext)

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [addLeadSheetOpen, setAddLeadSheetOpen] = useState(false)

  return (
    <AddLeadContext.Provider value={{ open: addLeadSheetOpen, setOpen: setAddLeadSheetOpen }}>
      <div className="min-h-screen bg-canvas">
        {/* Sidebars */}
        <DesktopSidebar />
        <MobileSidebar
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main content — offset by sidebar width on desktop */}
        <div className="lg:pl-56 flex flex-col min-h-screen">
          <TopBar
            onMenuClick={() => setMobileSidebarOpen(true)}
            onAddLead={() => setAddLeadSheetOpen(true)}
          />

          {/* Page content */}
          <main className="flex-1 px-4 lg:px-6 py-6">
            <Outlet context={{ addLeadSheetOpen, setAddLeadSheetOpen }} />
          </main>
        </div>
      </div>
    </AddLeadContext.Provider>
  )
}