import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const all = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-[#E2E6ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1 py-3 text-sm overflow-x-auto">
          {all.map((item, i) => (
            <li key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
              )}
              {i === 0 && (
                <Home className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0 mr-0.5" />
              )}
              {item.href && i < all.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-[#6B7280] hover:text-[#0B2545] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#1A1A2E] font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              item: item.href ? `https://anzpostcode.com${item.href}` : undefined,
            })),
          }),
        }}
      />
    </nav>
  );
}
