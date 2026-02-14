"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradientShift bg-gradient-to-br from-indigo-600/10 via-rose-500/8 to-amber-500/8" />

            {/* Floating shapes */}
            <div className="elegant-shape w-[340px] h-[340px] rounded-[50px] -top-28 -left-28 bg-indigo-500/20" />
            <div className="elegant-shape-2 w-[280px] h-[280px] rounded-full top-1/3 -right-24 bg-rose-500/15" />
            <div className="elegant-shape w-[200px] h-[200px] rounded-[30px] bottom-20 left-[15%] bg-amber-500/10" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center max-w-[720px] pt-12">
                {/* Brand Mark (Big) */}
                <div className="mb-8 animate-fadeUp">
                    <img
                        src="/logo.png"
                        alt="BaldGuard AI"
                        className="w-24 h-24 mx-auto filter drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                    />
                </div>

                {/* Badge */}
                <span className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] text-indigo-300 mb-7 animate-fadeUp-delay-1 font-semibold uppercase">
                    AI-Powered Hair Analysis
                </span>

                {/* Headline */}
                <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[1.08] mb-6 animate-fadeUp-delay-1">
                    Detect Hair Loss
                    <br />
                    <span className="text-gradient">Before It Detects You</span>
                </h1>

                {/* Subhead */}
                <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-[520px] mx-auto leading-relaxed animate-fadeUp-delay-2">
                    Neural pattern detection for early-stage hair thinning analysis.
                    Private, instant, and beautifully clear.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 max-w-[380px] mx-auto animate-fadeUp-delay-3">
                    <Link
                        href="/scan"
                        className="btn-primary flex-1 animate-glowPulse"
                    >
                        Start Free Scan
                    </Link>

                    <a href="#how" className="btn-glass flex-1">
                        How It Works
                    </a>
                </div>

                {/* Trust signal */}
                <p className="text-slate-600 text-xs mt-8 animate-fadeUp-delay-3">
                    No sign-up required · Images processed privately · Free to use
                </p>
            </div>
        </section>
    );
}
