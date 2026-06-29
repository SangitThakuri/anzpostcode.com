import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBox from "@/components/ui/SearchBox";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="text-7xl font-bold text-[#E2E6ED] mb-6 font-[family-name:var(--font-sora)]">
            404
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] mb-3 font-[family-name:var(--font-sora)]">
            Page not found
          </h1>
          <p className="text-[#6B7280] mb-8">
            This suburb or postcode page doesn&apos;t exist yet. Use the search below to find what you&apos;re looking for.
          </p>
          <div className="mb-8">
            <SearchBox placeholder="Search suburbs or postcodes…" />
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/au" className="text-[#E8472A] hover:underline font-medium">
              🇦🇺 Browse Australia
            </Link>
            <Link href="/nz" className="text-[#2D6A4F] hover:underline font-medium">
              🇳🇿 Browse New Zealand
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
