import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact ANZ Postcode",
  description: "Get in touch with the ANZPostcode team.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <main>
        <section className="bg-gradient-to-br from-[#0B2545] to-[#112d5e] text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg">We&apos;d love to hear from you.</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E6ED] p-8">
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-[#0B2545] mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Name</label>
                <input type="text" className="w-full border border-[#E2E6ED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8472A] focus:ring-2 focus:ring-[#E8472A]/20 transition-all" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Email</label>
                <input type="email" className="w-full border border-[#E2E6ED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8472A] focus:ring-2 focus:ring-[#E8472A]/20 transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Message</label>
                <textarea rows={5} className="w-full border border-[#E2E6ED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8472A] focus:ring-2 focus:ring-[#E8472A]/20 transition-all resize-none" placeholder="Your message…" />
              </div>
              <button type="button" className="w-full bg-[#E8472A] hover:bg-[#d43d22] text-white font-semibold py-3 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </div>
          <div className="bg-[#F4F6F9] rounded-2xl border border-[#E2E6ED] p-6 flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#E8472A] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#1A1A2E] text-sm mb-1">Data corrections</div>
              <p className="text-[#6B7280] text-sm">Found an error in our data? Please let us know and we&apos;ll investigate promptly.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
