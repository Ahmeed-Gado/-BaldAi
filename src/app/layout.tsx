import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BaldGuard AI | Detect Hair Loss Before It Detects You",
  description:
    "AI-powered early hair thinning detection using neural pattern analysis. Upload a scalp image and get instant, private risk assessment.",
  keywords: [
    "hair loss detection",
    "AI hair analysis",
    "baldness prevention",
    "scalp analysis",
    "hair thinning",
  ],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "BaldGuard AI",
    description: "Detect hair loss before it detects you. AI-powered scalp analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
