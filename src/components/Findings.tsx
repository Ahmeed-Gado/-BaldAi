"use client";

import Link from "next/link";

type Zone = "Green" | "Yellow" | "Red";

const ZONE_FINDINGS: Record<Zone, string[]> = {
    Green: [
        "No significant thinning markers detected",
        "Hair density appears within healthy range",
        "Continue current routine and monitor periodically",
    ],
    Yellow: [
        "Mild thinning markers detected near crown region",
        "Early-stage density reduction identified",
        "Preventive action recommended — see AI chat for guidance",
    ],
    Red: [
        "Active thinning patterns detected in multiple zones",
        "Notable density reduction compared to baseline estimates",
        "Professional dermatological consultation recommended",
    ],
};

const BASE_FINDINGS = [
    "Scalp visibility estimate completed",
    "Crown density pattern analyzed",
    "Follicle distribution consistency checked",
];

export default function Findings({ zone }: { zone: Zone }) {
    const findings = [...ZONE_FINDINGS[zone], ...BASE_FINDINGS].slice(0, 5);

    return (
        <div className="glass rounded-3xl p-8 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                        fact_check
                    </span>
                </div>
                <h3 className="text-xl font-bold">Key Findings</h3>
            </div>

            <ul className="space-y-3 mb-8">
                {findings.map((f, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
                    >
                        <span className="material-symbols-outlined text-indigo-400/70 text-[16px] mt-0.5 shrink-0">
                            check_circle
                        </span>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <div className="space-y-3">
                <Link
                    href="/scan"
                    className="w-full btn-primary text-sm py-3.5 block text-center"
                >
                    <span className="material-symbols-outlined text-[16px] mr-1.5">
                        refresh
                    </span>
                    Scan Again
                </Link>
                <button className="w-full btn-glass text-sm py-3.5">
                    <span className="material-symbols-outlined text-[16px] mr-1.5">
                        download
                    </span>
                    Download Report (Coming Soon)
                </button>
            </div>
        </div>
    );
}
