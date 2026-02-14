"use client";

import { useEffect } from "react";

export function useRevealOnScroll() {
    useEffect(() => {
        const els = Array.from(
            document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
        );
        if (!els.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
