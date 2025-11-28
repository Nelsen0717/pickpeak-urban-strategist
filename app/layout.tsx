import type { Metadata } from "next";
import { Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });
const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: '--font-signature'
});

export const metadata: Metadata = {
  title: "PickPeak: The Urban Strategist",
  description: "A gamified CRE learning experience for Funraise employees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} ${greatVibes.variable}`}>{children}</body>
    </html>
  );
}
