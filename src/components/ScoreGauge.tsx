"use client";

type Props = {
    score: number;
    zone: "Green" | "Yellow" | "Red";
    confidence: number;
};

function zoneConfig(zone: Props["zone"]) {
    switch (zone) {
        case "Green":
            return {
                glow: "zone-glow-green",
                ring: "border-green-500/40",
                badge: "bg-green-500/15 text-green-200 border border-green-500/25",
                gradStart: "rgba(34,197,94,0.9)",
                gradEnd: "rgba(34,197,94,0.15)",
                label: "Healthy",
                icon: "check_circle",
            };
        case "Red":
            return {
                glow: "zone-glow-red",
                ring: "border-red-500/40",
                badge: "bg-red-500/15 text-red-200 border border-red-500/25",
                gradStart: "rgba(239,68,68,0.9)",
                gradEnd: "rgba(239,68,68,0.15)",
                label: "At Risk",
                icon: "warning",
            };
        default:
            return {
                glow: "zone-glow-yellow",
                ring: "border-amber-500/40",
                badge: "bg-amber-500/15 text-amber-200 border border-amber-500/25",
                gradStart: "rgba(245,158,11,0.9)",
                gradEnd: "rgba(245,158,11,0.15)",
                label: "Early Warning",
                icon: "info",
            };
    }
}

export default function ScoreGauge({ score, zone, confidence }: Props) {
    const c = zoneConfig(zone);
    const deg = Math.round((score / 100) * 360);

    return (
        <div className={`glass rounded-3xl p-8 ${c.glow} animate-slideUp`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Hair Health Score</h2>
                    <p className="text-slate-400 text-sm">
                        AI-estimated from your uploaded scalp image.
                    </p>
                </div>
                <span
                    className={`text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide flex items-center gap-1.5 ${c.badge}`}
                >
                    <span className="material-symbols-outlined text-[14px]">{c.icon}</span>
                    {zone.toUpperCase()} · {c.label}
                </span>
            </div>

            {/* Gauge */}
            <div className="mt-8 mb-8 flex items-center justify-center">
                <div className={`relative w-48 h-48 rounded-full border-2 ${c.ring}`}>
                    {/* Conic gradient */}
                    <div
                        className="absolute inset-2 rounded-full border border-white/10 conic-progress"
                        style={{
                            background: `conic-gradient(${c.gradStart} ${deg}deg, rgba(255,255,255,0.04) 0deg)`,
                        }}
                    />
                    {/* Inner circle */}
                    <div className="absolute inset-4 rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center">
                        <div className="text-5xl font-extrabold tracking-tight">{score}</div>
                        <div className="text-xs text-slate-500 tracking-[0.15em] mt-1">
                            / 100
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.02] rounded-xl px-4 py-3">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                        Confidence
                    </div>
                    <div className="font-mono font-bold text-lg">
                        {Math.round(confidence * 100)}%
                    </div>
                </div>
                <div className="bg-white/[0.02] rounded-xl px-4 py-3">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                        Zone
                    </div>
                    <div className="font-bold text-lg">{zone}</div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-5 text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[12px] mt-0.5">info</span>
                Informational only — not a medical diagnosis.
            </p>
        </div>
    );
}
