"use client";

import Link from "next/link";
import { useRevealOnScroll } from "./useRevealOnScroll";

export default function CTA() {
    useRevealOnScroll();

    return (
        <section className="px-6 mb-32 reveal">
            <div className="relative max-w-[600px] mx-auto overflow-hidden rounded-3xl">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-rose-500/10 to-amber-500/10 animate-gradientShift" />

                <div className="relative glass-strong p-10 md:p-14 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to secure your hairline?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-[400px] mx-auto leading-relaxed">
                        Catch thinning markers before they become visible.
                        AI analysis takes under 10 seconds.
                    </p>
                    <Link
                        href="/scan"
                        className="inline-block w-full max-w-[320px] bg-white text-black py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Get Started Free
                    </Link>
                    <p className="text-slate-600 text-xs mt-5">
                        No sign-up · No credit card · Instant results
                    </p>
                </div>
            </div>
        </section>
    );
}
