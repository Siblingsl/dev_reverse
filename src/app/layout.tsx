import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AdsterraSocialBar } from "@/components/adsterra";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "DevReverse - 在线代码还原工具箱",
  description:
    "支持 Python 字节码还原、JavaScript 反混淆、小程序解包的在线安全分析工具",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}

        {/* 1. 引入 JS Beautify (你原有的) */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js"
          strategy="beforeInteractive"
        />

        {/* 2. ✅ 新增: 引入 Pyodide (用于运行 Python) */}
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"
          strategy="beforeInteractive"
        />
        <AdsterraSocialBar />
      </body>
    </html>
  );
}
