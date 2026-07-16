"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-xs text-[#6B7280] hover:text-[#1A1A2E] flex items-center gap-1 border border-[#E2E6ED] rounded-lg px-2.5 py-1.5 hover:border-[#1A1A2E] transition-colors"
    >
      🖨 Print
    </button>
  );
}
