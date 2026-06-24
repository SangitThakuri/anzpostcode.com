import { Info } from "lucide-react";

export default function DataDisclaimer() {
  return (
    <div className="bg-[#F4F6F9] border border-[#E2E6ED] rounded-xl p-4 flex items-start gap-3 text-sm text-[#6B7280]">
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0B2545]" />
      <p>
        Postcode information is provided for general reference only. For
        official delivery or address verification, please check{" "}
        <a
          href="https://auspost.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#0B2545]"
        >
          Australia Post
        </a>{" "}
        or{" "}
        <a
          href="https://www.nzpost.co.nz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#0B2545]"
        >
          NZ Post
        </a>
        .
      </p>
    </div>
  );
}
