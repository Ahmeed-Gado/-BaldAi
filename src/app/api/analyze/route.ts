import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            return NextResponse.json(
                { error: "Only JPG and PNG images are supported" },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image must be under 10MB" },
                { status: 400 }
            );
        }

        // Try forwarding to the FastAPI backend
        const backendUrl =
            process.env.AI_BACKEND_URL || "http://localhost:8000/analyze";

        try {
            const backendForm = new FormData();
            backendForm.append("image", file);

            const backendRes = await fetch(backendUrl, {
                method: "POST",
                body: backendForm,
            });

            if (!backendRes.ok) {
                // Pass client errors (4xx) through; anything else is a gateway failure
                const status = backendRes.status < 500 ? backendRes.status : 502;
                return NextResponse.json(
                    { error: "Analysis failed, please try again" },
                    { status }
                );
            }

            const result = await backendRes.json();
            return NextResponse.json(result);
        } catch (err: unknown) {
            // Backend unreachable: never return a result we did not get
            console.error(
                "AI backend request failed:",
                err instanceof Error ? err.name : "unknown"
            );
            return NextResponse.json(
                { error: "Analysis failed, please try again" },
                { status: 502 }
            );
        }
    } catch (err: unknown) {
        console.error("Analyze API error:", err);
        return NextResponse.json(
            { error: "Unexpected server error" },
            { status: 500 }
        );
    }
}
