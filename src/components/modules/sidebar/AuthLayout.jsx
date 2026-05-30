import { Heart } from "lucide-react";

/**
 * Split-screen auth layout.
 * left: dark panel content (stats, tagline, etc.)
 * right: form content
 */
export default function AuthLayout({ leftContent, rightContent }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex w-[420px] bg-dark-900 flex-col p-10 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold">SISTRA-TEC</p>
            <p className="text-gray-400 text-sm">Sistema de donaciones</p>
          </div>
        </div>
        {leftContent}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">{rightContent}</div>
      </div>
    </div>
  );
}
