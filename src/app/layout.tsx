import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeSelector } from "@/components/ui/ThemeSelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Concept LMS",
  description: "Learn and master digital and traditional art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-orange">
      <body className={`${inter.className} text-text-primary min-h-screen bg-background`}>
        <AuthProvider>
          {children}
          <ThemeSelector />
        </AuthProvider>
      </body>
    </html>
  );
}
