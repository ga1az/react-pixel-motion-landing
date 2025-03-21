import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { RootProvider } from "fumadocs-ui/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Pixel Motion",
  description: "A library for creating pixel animations with React",
  metadataBase: new URL("https://react-pixel-motion.ga1az.com/"),
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "React Pixel Motion",
    description: "A library for creating pixel animations with React",
    url: "https://react-pixel-motion.ga1az.com/",
    siteName: "React Pixel Motion",
    images: [
      {
        url: "/image.png",
        width: 1696,
        height: 611,
        alt: "React Pixel Motion",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RootProvider>{children}</RootProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
