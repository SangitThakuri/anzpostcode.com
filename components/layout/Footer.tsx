import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B2545] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E8472A] rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-[family-name:var(--font-sora)] font-bold text-lg">
                ANZ<span className="text-[#E8472A]">Postcode</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Australia & New Zealand postcode directory. Find postcodes,
              suburbs, and localities across both countries.
            </p>
          </div>

          {/* Australia */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              🇦🇺 Australia
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/au", label: "Overview" },
                { href: "/au/postcodes", label: "All Postcodes" },
                { href: "/au/suburbs", label: "All Suburbs" },
                { href: "/au/a-z", label: "A–Z Index" },
                { href: "/au/state/nsw", label: "New South Wales" },
                { href: "/au/state/vic", label: "Victoria" },
                { href: "/au/state/qld", label: "Queensland" },
                { href: "/au/state/wa", label: "Western Australia" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* New Zealand */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              🇳🇿 New Zealand
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/nz", label: "Overview" },
                { href: "/nz/postcodes", label: "All Postcodes" },
                { href: "/nz/localities", label: "All Localities" },
                { href: "/nz/a-z", label: "A–Z Index" },
                { href: "/nz/region/auckland", label: "Auckland" },
                { href: "/nz/region/wellington", label: "Wellington" },
                { href: "/nz/region/canterbury", label: "Canterbury" },
                { href: "/nz/region/waikato", label: "Waikato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/data-sources", label: "Data Sources" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/disclaimer", label: "Disclaimer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} ANZPostcode.com. All rights
              reserved.
            </p>
            <p className="text-white/40 text-xs max-w-md">
              Postcode information is provided for general reference only. For
              official delivery or address verification, please check Australia
              Post or NZ Post.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
