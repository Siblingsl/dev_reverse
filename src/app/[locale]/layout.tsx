import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AdsterraSocialBar } from "@/components/adsterra";

// ⚠️ 注意：因为文件移动到了 [locale] 文件夹，这里的路径需要向上跳两级
import "@/app/globals.css"

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. 等待 params 解析 (Next.js 15 要求)
  const { locale } = await params;

  // 2. 验证语言是否在支持列表中
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. 获取对应的翻译消息文件
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* 4. 使用 Provider 包裹应用，传入翻译数据 */}
        <NextIntlClientProvider messages={messages}>
          {children}

          {/* 保持原有的 Scripts 不变 */}
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js"
            strategy="beforeInteractive"
          />

          <Script
            src="https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.js"
            strategy="beforeInteractive"
          />

          <AdsterraSocialBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
