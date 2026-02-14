"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

export default function Privacy() {
    useRevealOnScroll();

    return (
        <section id="privacy" className="px-6 mb-32 reveal">
            <div className="max-w-[700px] mx-auto glass p-10 md:p-14 rounded-3xl text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-emerald-400 text-[28px]">
                        security
                    </span>
                </div>

                <h2 className="text-3xl font-bold mb-4">Your Privacy, Protected</h2>
                <p className="text-slate-400 leading-relaxed mb-8 max-w-[480px] mx-auto">
                    Images are processed in memory and never stored. No accounts required.
                    No data shared with third parties. HTTPS encrypted end-to-end.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {[
                        { icon: "delete_forever", label: "No storage" },
                        { icon: "vpn_lock", label: "HTTPS only" },
                        { icon: "visibility_off", label: "No tracking" },
                        { icon: "person_off", label: "No sign-up" },
                        { icon: "share_off", label: "No sharing" },
                        { icon: "shield", label: "In-memory" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2.5 text-slate-400 bg-white/[0.02] rounded-xl px-4 py-3"
                        >
                            <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                                {item.icon}
                            </span>
                            <span className="text-[13px]">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
