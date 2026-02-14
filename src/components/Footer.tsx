import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 py-14 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
                        <img
                            src="/logo.png"
                            alt="BaldGuard AI"
                            className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <span className="font-bold text-[16px] tracking-tight text-white uppercase tracking-[0.05em]">
                        BaldGuard <span className="text-indigo-400">AI</span>
                    </span>
                </Link>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-medium">
                    <Link href="/#how" className="hover:text-white transition-colors duration-200">
                        How it works
                    </Link>
                    <Link href="/#science" className="hover:text-white transition-colors duration-200">
                        Science
                    </Link>
                    <Link href="/#privacy" className="hover:text-white transition-colors duration-200">
                        Privacy
                    </Link>
                    <Link href="/scan" className="hover:text-white transition-colors duration-200">
                        Scan
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="text-center max-w-[460px]">
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                        © 2025 BaldGuard AI Technologies. This AI analysis is informational
                        only and does not replace professional medical advice. Results may
                        vary. Consult a dermatologist for clinical diagnoses.
                    </p>
                </div>
            </div>
        </footer>
    );
}
