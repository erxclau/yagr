import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const franklin = localFont({
  src: [
    {
      path: "./fonts/franklin/FranklinITCStd-Bold.otf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./fonts/franklin/FranklinITCStd-BoldItalic.otf",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./fonts/franklin/FranklinITCStd-Light.otf",
      style: "normal",
    },
    {
      path: "./fonts/franklin/FranklinITCStd-LightItalic.otf",
      style: "italic",
    },
  ],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  variable: "--font-franklin",
  fixedFontFamily: "Franklin"
});

const postoni = localFont({
  src: [
    {
      path: "./fonts/postoni/Postoni-Bold.otf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "./fonts/postoni/Postoni-BoldItalic.otf",
      weight: "bold",
      style: "italic",
    },
    {
      path: "./fonts/postoni/Postoni-Light.otf",
      style: "normal",
    },
    {
      path: "./fonts/postoni/Postoni-LightItalic.otf",
      style: "italic",
    },
  ],
  fallback: ["serif"],
  variable: "--font-postoni",
  fixedFontFamily: "Postoni"
});

export const metadata: Metadata = {
  title: "yagr-next",
  description: "Yet another graphics rig",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${franklin.variable} ${postoni.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
