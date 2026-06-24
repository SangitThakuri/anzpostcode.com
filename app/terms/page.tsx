import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use – ANZ Postcode",
  description: "Terms of use for ANZPostcode.com",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Terms of Use" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold">Terms of Use</h1>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <p className="text-[#6B7280] mb-6">Last updated: {new Date().getFullYear()}</p>
            {[
              { title: "Acceptance of Terms", body: "By accessing ANZPostcode.com, you agree to these terms. If you do not agree, please do not use this site." },
              { title: "Use of Information", body: "The postcode data on this site is provided for general reference only. ANZPostcode.com is not an official postal authority and makes no guarantees about the accuracy or completeness of the data." },
              { title: "No Warranty", body: "This service is provided 'as is' without warranty of any kind. We do not guarantee that the site will be available at all times." },
              { title: "Intellectual Property", body: "The site design, layout, and brand elements are the property of ANZPostcode.com. Postcode data is sourced from community-maintained open datasets." },
              { title: "Limitation of Liability", body: "ANZPostcode.com shall not be liable for any loss or damage arising from the use of information on this site." },
              { title: "Changes", body: "We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms." },
            ].map((section) => (
              <div key={section.title} className="mb-6">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-[#0B2545] mb-2">{section.title}</h2>
                <p className="text-[#6B7280] leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
