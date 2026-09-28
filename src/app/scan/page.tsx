"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadCard from "@/components/UploadCard";
import ScanAnimation from "@/components/ScanAnimation";
import { useRouter } from "next/navigation";

const STATUS = [
    "Analyzing follicle density…",
    "Detecting thinning patterns…",
    "Generating confidence score…",
    "Finalizing report…",
];

const ZONES = ["Green", "Yellow", "Red"] as const;
const GENERIC_ERROR = "Analysis failed, please try again.";

type AnalysisResult = {
    score: number;
    zone: (typeof ZONES)[number];
    confidence: number;
};

function isAnalysisResult(data: unknown): data is AnalysisResult {
    if (typeof data !== "object" || data === null) return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.score === "number" && d.score >= 0 && d.score <= 100 &&
        typeof d.confidence === "number" && d.confidence >= 0 && d.confidence <= 1 &&
        ZONES.includes(d.zone as AnalysisResult["zone"])
    );
}

// Fixed client-side messages: server error text is never rendered
function errorMessageForStatus(status: number): string {
    if (status === 413) return "Image must be under 10MB.";
    if (status === 400 || status === 415) return "Please upload a valid JPG or PNG image.";
    return GENERIC_ERROR;
}

export default function ScanPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const statusText = useMemo(() => {
        const idx = Math.min(
            STATUS.length - 1,
            Math.floor((progress / 100) * STATUS.length)
        );
        return STATUS[idx];
    }, [progress]);

    // Release the in-memory preview when it is replaced or the page unmounts
    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    // Progress animation
    useEffect(() => {
        if (!scanning) return;

        const t = setInterval(() => {
            setProgress((p) => {
                const next = Math.min(100, p + Math.floor(4 + Math.random() * 8));
                return next;
            });
        }, 500);

        return () => clearInterval(t);
    }, [scanning]);

    // On progress complete, call API or navigate
    useEffect(() => {
        if (!scanning || progress < 100) return;

        function failScan(message: string) {
            setScanning(false);
            setProgress(0);
            setError(message);
        }

        async function runAnalysis() {
            try {
                const fd = new FormData();
                fd.append("image", file!);

                // In production, this should be your Cloud Run URL
                const backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "http://localhost:8000/analyze";

                const res = await fetch(backendUrl, {
                    method: "POST",
                    body: fd,
                });

                if (!res.ok) {
                    failScan(errorMessageForStatus(res.status));
                    return;
                }

                const data: unknown = await res.json();
                if (!isAnalysisResult(data)) {
                    failScan(GENERIC_ERROR);
                    return;
                }

                const params = new URLSearchParams({
                    score: String(data.score),
                    zone: data.zone,
                    confidence: String(data.confidence),
                });
                router.push(`/results?${params.toString()}`);
            } catch {
                // Backend unreachable: never show a result we did not get
                failScan(GENERIC_ERROR);
            }
        }

        runAnalysis();
    }, [progress, scanning, router, file]);

    function handlePick(f: File) {
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    }

    function startScan() {
        setProgress(0);
        setError(null);
        setScanning(true);
    }

    function handleClear() {
        setFile(null);
        setPreviewUrl(null);
        setScanning(false);
        setProgress(0);
        setError(null);
    }

    return (
        <>
            <Header />
            <main className="pt-24 pb-8 px-6 min-h-screen">
                <div className="max-w-[1100px] mx-auto">
                    {/* Page header */}
                    <div className="mb-8 animate-fadeUp">
                        <span className="inline-block glass px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] text-indigo-300 mb-4 font-medium uppercase">
                            AI Scanner
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                            Upload & Scan
                        </h1>
                        <p className="text-slate-400 max-w-[480px]">
                            Upload a clear scalp photo and our AI will analyze it in seconds.
                            Your image is processed privately and never stored.
                        </p>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="animate-fadeUp-delay-1">
                            <UploadCard
                                file={file}
                                previewUrl={previewUrl}
                                onPick={handlePick}
                                onClear={handleClear}
                            />
                        </div>

                        <div className="animate-fadeUp-delay-2">
                            {!previewUrl ? (
                                /* Tips card */
                                <div className="glass rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-amber-400 text-[20px]">
                                                tips_and_updates
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold">Tips for best accuracy</h2>
                                    </div>

                                    <ul className="text-slate-400 text-sm leading-relaxed space-y-4">
                                        {[
                                            { icon: "light_mode", text: "Use bright, even overhead lighting — avoid direct sunlight and shadows." },
                                            { icon: "center_focus_strong", text: "Capture the top/crown area clearly — hold camera 8-12 inches above." },
                                            { icon: "filter_none", text: "Avoid filters, compression, and editing — keep the image natural." },
                                            { icon: "water_drop", text: "Hair should be dry and not covered — wet hair looks thinner." },
                                        ].map((tip) => (
                                            <li key={tip.icon} className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-slate-500 text-[18px] mt-0.5 shrink-0">
                                                    {tip.icon}
                                                </span>
                                                <span>{tip.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0">
                                                info
                                            </span>
                                            This AI analysis is informational only and does not replace
                                            professional medical advice. Consult a dermatologist for
                                            clinical diagnoses.
                                        </p>
                                    </div>
                                </div>
                            ) : !scanning ? (
                                /* Ready to scan */
                                <div className="glass rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
                                                check_circle
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold">Ready to scan</h2>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                        Your image looks ready. Start the AI scan to get your hair
                                        health score, zone classification, and personalized findings.
                                    </p>

                                    {error && (
                                        <div
                                            role="alert"
                                            className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={startScan}
                                        className="w-full btn-primary animate-glowPulse text-lg py-5"
                                    >
                                        <span className="material-symbols-outlined mr-2 text-[20px]">
                                            {error ? "refresh" : "neurology"}
                                        </span>
                                        {error ? "Try again" : "Start AI Scan"}
                                    </button>

                                    <button
                                        onClick={handleClear}
                                        className="w-full mt-3 btn-glass"
                                    >
                                        Choose a different photo
                                    </button>
                                </div>
                            ) : (
                                /* Scanning animation */
                                <ScanAnimation
                                    previewUrl={previewUrl}
                                    progress={progress}
                                    statusText={statusText}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
