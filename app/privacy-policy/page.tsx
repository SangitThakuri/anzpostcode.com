import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy – ANZ Postcode",
  description: "Privacy policy for ANZPostcode.com",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold">Privacy Policy</h1>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8 prose prose-sm max-w-none">
            <p className="text-[#6B7280] mb-6">Last updated: {new Date().getFullYear()}</p>
            {[
              { title: "Information We Collect", body: "ANZPostcode.com is a static website. We do not collect personal information, require registration, or maintain user accounts. If you contact us via our contact form, we may receive your name, email, and message." },
              { title: "Analytics", body: "We may use privacy-respecting analytics to understand site usage. These tools do not identify individual visitors." },
              { title: "Cookies", body: "This site uses minimal cookies necessary for basic functionality. We do not use tracking or advertising cookies." },
              { title: "Third-Party Services", body: "Pages include OpenStreetMap tiles for map functionality. OpenStreetMap's own privacy policy applies when maps are loaded. We do not use Google Maps or other paid map services." },
              { title: "Data Retention", body: "We do not store personal user data on our servers." },
              { title: "Contact", body: "For privacy-related questions, please use our contact page." },
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
