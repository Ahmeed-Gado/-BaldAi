"use client";

import { useRevealOnScroll } from "./useRevealOnScroll";

const STATS = [
    {
        value: "99%",
        label: "Precision",
        color: "text-indigo-400",
        icon: "verified",
    },
    {
        value: "<10s",
        label: "Analysis Time",
        color: "text-rose-400",
        icon: "speed",
    },
    {
        value: "50k+",
        label: "Scans Completed",
        color: "text-amber-400",
        icon: "group",
    },
    {
        value: "100%",
        label: "Private",
        color: "text-emerald-400",
        icon: "lock",
    },
];

export default function Stats() {
    useRevealOnScroll();

    return (
        <section className="px-6 mb-28 reveal-stagger reveal">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[900px] mx-auto">
                {STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="reveal-child glass p-6 rounded-2xl text-center hover-lift cursor-default"
                    >
                        <span className={`material-symbols-outlined ${stat.color} text-[28px] mb-3 block`}>
                            {stat.icon}
                        </span>
                        <div className={`${stat.color} text-2xl font-bold mb-1`}>{stat.value}</div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
