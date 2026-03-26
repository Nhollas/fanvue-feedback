import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Header } from "@/components/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanvue Feedback",
  description: "Share ideas and vote on what Fanvue should build next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-dvh flex flex-col antialiased">
        <NuqsAdapter>
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
              {children}
            </div>
          </main>
        </NuqsAdapter>
      </body>
    </html>
  );
}
