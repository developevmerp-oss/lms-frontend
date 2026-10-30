import type { Metadata } from "next";
import { Fraunces, Inter, Nunito_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { MetaPixelProvider } from "@/components/marketing/MetaPixelProvider";

const inter = Inter({ subsets: ["latin"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-landing" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "Ravishing Art Hub | Masterclass & LMS",
  description: "Learn and master digital and traditional art.",
  icons: {
    icon: "/new_favicon.png",
    shortcut: "/new_favicon.png",
    apple: "/new_favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`theme-orange ${fraunces.variable} ${nunito.variable} ${caveat.variable}`}>
      <body className={`${inter.className} text-text-primary min-h-screen bg-background`}>
        <AuthProvider>
          <MetaPixelProvider />
          {children}
          {/* <ThemeSelector /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
