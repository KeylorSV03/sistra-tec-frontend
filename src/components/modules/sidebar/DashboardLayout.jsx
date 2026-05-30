/**
 * Base layout for all authenticated pages.
 * Combines the sidebar with a scrollable main content area.
 */
export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebar}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
