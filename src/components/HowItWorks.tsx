"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

const STEPS = [
    {
        num: "01",
        title: "Upload",
        desc: "Capture a clear crown or top-of-head photo in good, even lighting. No filters needed.",
        icon: "cloud_upload",
        accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
        num: "02",
        title: "AI Analysis",
        desc: "Our neural network estimates follicle density, thinning patterns, and scalp visibility in seconds.",
        icon: "neurology",
        accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
        num: "03",
        title: "Results + Chat",
        desc: "Get a clear zone score with key findings, then talk to the AI for personalized prevention advice.",
        icon: "chat",
        accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
];

export default function HowItWorks() {
    useRevealOnScroll();

    return (
        <section id="how" className="px-6 mb-32 reveal">
            <div className="max-w-[1000px] mx-auto">
                {/* Section header */}
                <div className="text-center mb-14">
                    <span className="inline-block glass px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] text-indigo-300 mb-4 font-medium uppercase">
                        Simple Process
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How it works
                    </h2>
                    <p className="text-slate-400 max-w-[520px] mx-auto leading-relaxed">
                        A clean 3-step flow designed for speed, clarity, and privacy.
                        No sign-up, no data stored.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
                    {STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="reveal-child glass p-8 rounded-3xl hover-lift group"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${step.accent} border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                            >
                                <span className="material-symbols-outlined text-[22px]">
                                    {step.icon}
                                </span>
                            </div>
                            <div className="text-indigo-300/40 text-[11px] tracking-[0.2em] font-mono mb-2">
                                STEP {step.num}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
