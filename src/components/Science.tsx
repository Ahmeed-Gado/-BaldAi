"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

const FEATURES = [
    {
        title: "Transfer Learning CNN",
        desc: "Pre-trained on dermatological datasets with fine-tuning for follicle density estimation.",
        icon: "psychology",
    },
    {
        title: "Multi-Zone Analysis",
        desc: "Separate evaluation of crown, temple, and frontal hairline regions for comprehensive results.",
        icon: "grid_view",
    },
    {
        title: "Confidence Scoring",
        desc: "Each result includes a confidence interval so you understand exactly how certain the analysis is.",
        icon: "analytics",
    },
    {
        title: "Grad-CAM Ready",
        desc: "Architecture supports visual heatmap overlays to show which areas the AI focused on (coming soon).",
        icon: "visibility",
    },
];

export default function Science() {
    useRevealOnScroll();

    return (
        <section id="science" className="px-6 mb-32 reveal">
            <div className="max-w-[1000px] mx-auto">
                {/* Section header */}
                <div className="text-center mb-14">
                    <span className="inline-block glass px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] text-indigo-300 mb-4 font-medium uppercase">
                        Under the Hood
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        The Science
                    </h2>
                    <p className="text-slate-400 max-w-[520px] mx-auto leading-relaxed">
                        Built on proven computer vision techniques used in dermatological
                        research, adapted for accessible consumer use.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid md:grid-cols-2 gap-5 reveal-stagger">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="reveal-child glass p-7 rounded-2xl hover-lift group flex gap-5"
                        >
                            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                                    {f.icon}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold mb-1.5">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
