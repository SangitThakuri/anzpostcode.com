import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer – ANZ Postcode",
  description: "Disclaimer for ANZPostcode.com postcode data.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold">Disclaimer</h1>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 space-y-6">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-2">General Information</h2>
              <p className="text-[#6B7280] leading-relaxed">The information on ANZPostcode.com is provided for general reference purposes only. While we strive to keep data accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.</p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-2">Not an Official Source</h2>
              <p className="text-[#6B7280] leading-relaxed">ANZPostcode.com is not affiliated with, endorsed by, or connected to Australia Post, New Zealand Post, or any government agency. This site does not provide official postal address verification. For official postcode lookups, please use Australia Post or NZ Post directly.</p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-2">Accuracy of Data</h2>
              <p className="text-[#6B7280] leading-relaxed">Postcodes change over time. Our data may not reflect the most recent changes. Always verify critical postcode information with the relevant postal authority before use in mail delivery or official documents.</p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-2">External Links</h2>
              <p className="text-[#6B7280] leading-relaxed">Our pages include links to external websites. We have no control over the content of those sites and accept no responsibility for them.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
