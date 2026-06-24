"use client";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu, X, Search } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B2545] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#E8472A] rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-[family-name:var(--font-sora)] text-white font-bold text-lg leading-tight">
              ANZ<span className="text-[#E8472A]">Postcode</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/au"
              className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🇦🇺 Australia
            </Link>
            <Link
              href="/nz"
              className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🇳🇿 New Zealand
            </Link>
            <Link
              href="/search"
              className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/au/postcodes"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Browse AU
            </Link>
            <Link
              href="/nz/postcodes"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Browse NZ
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white/80 hover:text-white p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 space-y-1">
            <Link
              href="/au"
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
            >
              🇦🇺 Australia
            </Link>
            <Link
              href="/nz"
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
            >
              🇳🇿 New Zealand
            </Link>
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
            >
              🔍 Search
            </Link>
            <Link
              href="/au/postcodes"
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse AU Postcodes
            </Link>
            <Link
              href="/nz/postcodes"
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse NZ Postcodes
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
