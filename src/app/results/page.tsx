"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScoreGauge from "@/components/ScoreGauge";
import Findings from "@/components/Findings";
import ChatPanel from "@/components/ChatPanel";

type Zone = "Green" | "Yellow" | "Red";

const ZONES: readonly Zone[] = ["Green", "Yellow", "Red"];
const DEFAULT_ZONE: Zone = "Yellow";

// ?zone= is user-controlled: only allowlisted values get through
function parseZone(value: string | null): Zone {
    return ZONES.includes(value as Zone) ? (value as Zone) : DEFAULT_ZONE;
}

function ResultsContent() {
    const sp = useSearchParams();

    const score = Number(sp.get("score") ?? 72);
    const zone = parseZone(sp.get("zone"));
    const confidence = Number(sp.get("confidence") ?? 0.91);

    return (
        <>
            <Header />
            <main className="pt-24 pb-8 px-6 min-h-screen">
                <div className="max-w-[1100px] mx-auto">
                    {/* Page header */}
                    <div className="mb-8 animate-fadeUp">
                        <span className="inline-block glass px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] text-indigo-300 mb-4 font-medium uppercase">
                            Analysis Complete
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                            Your Results
                        </h1>
                        <p className="text-slate-400 max-w-[520px]">
                            Here&apos;s your AI-generated hair health assessment. Scroll down to
                            chat with the AI assistant for personalized guidance.
                        </p>
                    </div>

                    {/* Score + Findings */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        <ScoreGauge score={score} zone={zone} confidence={confidence} />
                        <Findings zone={zone} />
                    </div>

                    {/* Chat */}
                    <div className="mb-16">
                        <ChatPanel zone={zone} score={score} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function ResultsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-slate-500 animate-pulse">Loading results…</div>
                </div>
            }
        >
            <ResultsContent />
        </Suspense>
    );
}
