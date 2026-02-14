"use client";

import { useMemo, useRef, useState, useEffect } from "react";

type Msg = { role: "user" | "ai"; text: string };

export default function ChatPanel({
    zone,
    score,
}: {
    zone: "Green" | "Yellow" | "Red";
    score: number;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Msg[]>([
        {
            role: "ai",
            text: `Hi! I'm your BaldGuard AI assistant. Based on your result (${zone} zone, score ${score}/100), I can help with prevention routines, product suggestions, and general hair health guidance. What would you like to know?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const suggestions = useMemo(
        () => [
            "Is this reversible?",
            "Suggest a 30-day routine",
            "What products help?",
            "What causes thinning?",
            "Should I see a doctor?",
        ],
        []
    );

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    function aiReply(userText: string): string {
        const lc = userText.toLowerCase();
        const disclaimer = "\n\n_This is informational, not medical advice._";

        const preface =
            zone === "Green"
                ? "Your score looks healthy! Focus on maintenance."
                : zone === "Red"
                    ? "Your results suggest active thinning — early action can make a big difference."
                    : "You're in an early warning zone — this is actually a great time to act.";

        if (lc.includes("products") || lc.includes("product") || lc.includes("help")) {
            return `${preface}\n\nCommon options people consider:\n\n• **Gentle anti-shedding shampoos** (ketoconazole-based or biotin-enriched)\n• **Scalp serums** with caffeine or saw palmetto\n• **Nutritional support** — Vitamin D, Zinc, Biotin, and Iron if deficient\n• **Minoxidil** (OTC, clinically proven for regrowth in many cases)\n\nFor ${zone === "Red" ? "your zone" : "preventive care"}, consulting a dermatologist is valuable.${disclaimer}`;
        }

        if (lc.includes("reversible") || lc.includes("reverse") || lc.includes("grow back")) {
            return `${preface}\n\nEarly-stage thinning is often the most manageable:\n\n• **Lifestyle factors** (stress, sleep, nutrition) can significantly impact hair health\n• **Consistency** is key — most treatments need 3-6 months to show results\n• **Genetic factors** affect how much regrowth is possible\n• **Medical options** like minoxidil and finasteride have clinical evidence\n\nThe earlier you act, the better the outcomes tend to be.${disclaimer}`;
        }

        if (lc.includes("routine") || lc.includes("30") || lc.includes("plan")) {
            return `${preface}\n\n**30-Day Prevention Plan:**\n\n**Week 1-2:** Baseline\n• Gentle shampoo 3-4x/week\n• 5-min scalp massage daily\n• Start tracking photos\n\n**Week 2-3:** Nutrition\n• Increase protein + hydration\n• Add Vitamin D, Zinc if needed\n• Reduce stress triggers\n\n**Week 3-4:** Review\n• Re-scan with BaldGuard AI\n• Compare progress\n• Consider dermatologist if concerned\n\nConsistency beats intensity!${disclaimer}`;
        }

        if (lc.includes("cause") || lc.includes("why") || lc.includes("reason")) {
            return `${preface}\n\nCommon causes of hair thinning:\n\n• **Genetics** (androgenetic alopecia) — most common cause\n• **Stress** — both physical and emotional can trigger telogen effluvium\n• **Nutrition** — iron, vitamin D, and protein deficiencies\n• **Hormonal changes** — thyroid issues, postpartum, menopause\n• **Medications** — some can cause hair loss as a side effect\n• **Scalp conditions** — dermatitis, fungal infections\n\nUnderstanding your specific cause helps target the right solution.${disclaimer}`;
        }

        if (lc.includes("doctor") || lc.includes("dermatologist") || lc.includes("professional")) {
            return `${preface}\n\nWhen to see a professional:\n\n• **Sudden or rapid hair loss** — could indicate a medical condition\n• **Patchy loss** — may suggest alopecia areata\n• **Scalp symptoms** — itching, redness, or pain alongside thinning\n• **No improvement** after 3+ months of self-care\n• **Family history** of significant pattern baldness\n\n${zone === "Red" ? "Given your score, a dermatological consultation would be beneficial." : "It's always a good idea to get a baseline evaluation, even if preventive."}\n\nA dermatologist can do blood work, scalp analysis, and recommend targeted treatments.${disclaimer}`;
        }

        return `${preface}\n\nTell me more about:\n• Your age range and family history\n• Current stress levels\n• Diet and sleep patterns\n• Any existing hair care routine\n\nThis helps me tailor more specific advice for your situation.${disclaimer}`;
    }

    async function send(text: string) {
        const t = text.trim();
        if (!t || typing) return;

        setMessages((m) => [...m, { role: "user", text: t }]);
        setInput("");
        setTyping(true);

        // Simulate AI thinking time
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        const reply = aiReply(t);

        setMessages((m) => [...m, { role: "ai", text: reply }]);
        setTyping(false);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
        }
    }

    // Simple markdown-like rendering
    function renderText(text: string) {
        return text.split("\n").map((line, i) => {
            // Bold
            const formatted = line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white font-semibold">$1</strong>'
            );
            // Italic
            const formatted2 = formatted.replace(
                /_(.*?)_/g,
                '<em class="text-slate-500 text-xs">$1</em>'
            );

            if (line.trim() === "") return <br key={i} />;
            return (
                <span
                    key={i}
                    dangerouslySetInnerHTML={{ __html: formatted2 }}
                    className="block"
                />
            );
        });
    }

    return (
        <div
            className="glass rounded-3xl p-8 animate-slideUp"
            style={{ animationDelay: "0.2s" }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                            smart_toy
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Hair Health Assistant</h3>
                        <p className="text-slate-500 text-xs">AI-powered guidance</p>
                    </div>
                </div>
                <span className="text-[10px] text-slate-600 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/5">
                    Demo Chat
                </span>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 mb-5">
                {suggestions.map((s) => (
                    <button
                        key={s}
                        onClick={() => send(s)}
                        disabled={typing}
                        className="text-xs glass px-3.5 py-2 rounded-full hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Chat messages */}
            <div
                ref={scrollRef}
                className="h-80 overflow-y-auto border border-white/10 rounded-2xl p-4 bg-white/[0.015] chat-scroll"
            >
                <div className="space-y-3">
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={[
                                "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                m.role === "user"
                                    ? "ml-auto bg-indigo-600/25 border border-indigo-500/25"
                                    : "mr-auto glass",
                            ].join(" ")}
                        >
                            {m.role === "ai" ? (
                                <div className="space-y-0.5">{renderText(m.text)}</div>
                            ) : (
                                m.text
                            )}
                        </div>
                    ))}

                    {typing && (
                        <div className="mr-auto glass max-w-[60%] rounded-2xl px-4 py-3">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
                                <span className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
                                <span className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about prevention, products, or routines…"
                    disabled={typing}
                    className="w-full rounded-2xl bg-[#0a0a0a] border border-white/10 px-5 py-3.5 text-sm outline-none focus:border-indigo-500/40 transition-colors duration-200 disabled:opacity-50 placeholder:text-slate-600"
                />
                <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || typing}
                    className="bg-indigo-600 px-5 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
            </div>
        </div>
    );
}
