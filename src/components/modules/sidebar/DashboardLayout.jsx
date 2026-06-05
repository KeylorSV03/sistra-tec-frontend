/**
 * Base layout for all authenticated pages.
 * Combines the sidebar with a scrollable main content area.
 */
export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-700 focus:shadow"
      >
        Saltar al contenido principal
      </a>
      {sidebar}
      <main id="main-content" className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
