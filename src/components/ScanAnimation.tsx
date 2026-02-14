"use client";

type Props = {
    previewUrl: string;
    progress: number;
    statusText: string;
};

export default function ScanAnimation({ previewUrl, progress, statusText }: Props) {
    return (
        <div className="glass rounded-3xl p-8 overflow-hidden relative animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" style={{ animation: "pulseRing 1.5s ease-in-out infinite" }} />
                <h2 className="text-2xl font-bold">AI scanning…</h2>
            </div>
            <p className="text-slate-400 text-sm mb-6">{statusText}</p>

            {/* Scan viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                    src={previewUrl}
                    alt="scan"
                    className="w-full h-72 object-cover opacity-80"
                />

                {/* Scan line */}
                <div className="absolute inset-0 pointer-events-none scan-line-anim">
                    <div className="absolute left-0 right-0 h-28 top-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-indigo-400/25 to-transparent" />
                </div>

                {/* Shimmer */}
                <div className="absolute inset-0 pointer-events-none shimmer-anim">
                    <div className="absolute top-0 bottom-0 w-44 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                </div>

                {/* Corner markers */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-indigo-400/60 rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-indigo-400/60 rounded-tr-sm" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-indigo-400/60 rounded-bl-sm" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-indigo-400/60 rounded-br-sm" />

                {/* Bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
            </div>

            {/* Progress bar */}
            <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 font-medium">Neural progress</span>
                    <span className="font-mono text-indigo-400">{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                        style={{
                            width: `${progress}%`,
                            transition: "width 300ms linear",
                        }}
                    />
                </div>
            </div>

            {/* Phase indicators */}
            <div className="mt-5 flex gap-2">
                {["Density", "Pattern", "Scoring", "Report"].map((phase, i) => {
                    const threshold = (i + 1) * 25;
                    const active = progress >= threshold;
                    const current = progress >= threshold - 25 && progress < threshold;

                    return (
                        <div
                            key={phase}
                            className={[
                                "flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all duration-300",
                                active
                                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                                    : current
                                        ? "bg-white/[0.03] text-slate-300 border border-white/10"
                                        : "bg-white/[0.02] text-slate-600 border border-transparent",
                            ].join(" ")}
                        >
                            {phase}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
