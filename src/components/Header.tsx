"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={[
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                scrolled
                    ? "glass-strong border-b border-white/5"
                    : "bg-transparent border-b border-transparent",
            ].join(" ")}
        >
            <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="grid place-items-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
                        <img
                            src="/logo.png"
                            alt="BaldGuard AI"
                            className="w-[36px] h-[36px] object-contain"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        BaldGuard <span className="text-indigo-400">AI</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
                    <Link href="/#how" className="hover:text-white transition-colors duration-200">
                        How it works
                    </Link>
                    <Link href="/#science" className="hover:text-white transition-colors duration-200">
                        Science
                    </Link>
                    <Link href="/#privacy" className="hover:text-white transition-colors duration-200">
                        Privacy
                    </Link>
                </nav>

                {/* CTA */}
                <Link
                    href="/scan"
                    className="bg-indigo-600 px-5 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 animate-glowPulse shadow-lg shadow-indigo-500/20"
                >
                    Scan Now
                </Link>
            </div>
        </header>
    );
}
