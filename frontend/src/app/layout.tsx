import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product App",
  description: "Stage-1 Fullstack Task",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="border-b bg-white">
          <div className="mx-auto max-w-4xl p-4 flex items-center justify-between">
            <h1 className="text-lg font-bold">Fullstack Task</h1>
            <nav className="space-x-4 text-sm">
              <a href="/products" className="hover:underline">Products</a>
              <a href="/products/new" className="hover:underline">Add</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl p-6">{children}</main>
        <footer className="border-t bg-white text-center text-sm text-gray-500 p-4">
          © {new Date().getFullYear()} Fullstack Task
        </footer>
      </body>
    </html>
  );
}
