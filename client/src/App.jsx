import AppLayout from "./components/layout/AppLayout";
import LeadsTable from "./features/leads/components/LeadsTable";
import AddLeadSheet from "./features/leads/components/AddLeadSheet";
import DeleteConfirmModal from "./features/leads/components/DeleteConfirmModal";

function App() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Lead Management Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your leads, status updates, and pipeline.
          </p>
        </div>

        {/* Table */}
        <LeadsTable />

        {/* Global Modals / Sheets */}
        <AddLeadSheet />
  
      </div>
    </AppLayout>
  );
}

export default App;