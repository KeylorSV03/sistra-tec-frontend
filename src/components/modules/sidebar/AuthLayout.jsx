import { Heart } from "lucide-react";

/**
 * Split-screen auth layout.
 * left: dark panel content (stats, tagline, etc.)
 * right: form content
 */
export default function AuthLayout({ leftContent, rightContent }) {
  return (
    <div className="min-h-screen flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-700 focus:shadow"
      >
        Saltar al contenido principal
      </a>
      {/* Left panel */}
      <aside
        aria-label="Informacion de SISTRA-TEC"
        className="hidden md:flex w-[420px] bg-dark-900 flex-col p-10 shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Heart aria-hidden="true" className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">SISTRA-TEC</p>
            <p className="text-gray-400 text-sm">Sistema de donaciones</p>
          </div>
        </div>
        {leftContent}
      </aside>

      {/* Right panel */}
      <main id="main-content" className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">{rightContent}</div>
      </main>
    </div>
  );
}
