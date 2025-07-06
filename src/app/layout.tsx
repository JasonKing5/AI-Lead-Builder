import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomLink } from '@/components/ui/link'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Lead Builder",
  description: 'Generate and manage your leads with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">AI Lead Builder</h1>
            <nav className="space-x-4">
              <CustomLink href="/">Add Lead</CustomLink>
              <CustomLink href="/leads">View Leads</CustomLink>
            </nav>
          </div>
        </header>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
