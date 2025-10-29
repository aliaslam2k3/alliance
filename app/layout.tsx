import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alliance Engineers and Contractors - Superior Quality Construction",
  description: "Alliance Engineers & Contractors has been delivering trusted, high-quality, and cost-effective construction solutions across Pakistan for over 20 years. Guided by integrity, innovation, and professionalism, we build lasting partnerships and projects that strengthen communities.",
  keywords: "construction, engineering, contractors, Pakistan, building, infrastructure, quality construction",
  authors: [{ name: "Alliance Engineers and Contractors" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-inter bg-white text-gray-800 antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
