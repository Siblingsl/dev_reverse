"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; // 👈 1. 引入 Hook
import { Header } from "@/components/header";
import { PythonPanel } from "@/components/python-panel";
import { JsPanel } from "@/components/js-panel";
import { WxapkgPanel } from "@/components/wxapkg-panel";
import { Footer } from "@/components/footer";
import {
  AdsterraBanner160,
  AdsterraBanner728,
  AdsterraNativeBanner,
} from "@/components/adsterra";

export default function Home() {
  // 👈 2. 初始化翻译函数，使用 "HomePage" 命名空间
  const t = useTranslations("HomePage");

  const [activeTab, setActiveTab] = useState<"python" | "js" | "wxapkg">(
    "python"
  );

  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />

      {/* === 左侧广告 (优化版) === */}
      <div className="fixed right-[calc(50%+520px)] top-1/2 -translate-y-1/2 z-10">
        <AdsterraBanner160 />
      </div>

      {/* === 右侧广告 (优化版) === */}
      <div className="fixed left-[calc(50%+520px)] top-1/2 -translate-y-1/2 z-10">
        <AdsterraBanner160 />
      </div>

      {/* 顶部横幅广告 */}
      <div className="w-full bg-gray-50 border-b border-gray-100">
        <AdsterraBanner728 />
      </div>

      <main className="container mx-auto flex-1 px-5 py-10 max-w-[1000px]">
        {/* Tabs Navigation */}
        <div className="flex justify-center border-b-2 border-border mb-8">
          <button
            onClick={() => setActiveTab("python")}
            className={`px-6 py-3 text-base font-medium transition-all border-b-2 -mb-0.5 ${
              activeTab === "python"
                ? "text-blue-600 border-blue-600"
                : "text-muted-foreground border-transparent hover:text-blue-600"
            }`}
          >
            {/* 👈 3. 使用翻译键值 */}
            {t("tabs.python")}
          </button>
          <button
            onClick={() => setActiveTab("js")}
            className={`px-6 py-3 text-base font-medium transition-all border-b-2 -mb-0.5 ${
              activeTab === "js"
                ? "text-blue-600 border-blue-600"
                : "text-muted-foreground border-transparent hover:text-blue-600"
            }`}
          >
            {t("tabs.js")}
          </button>
          <button
            onClick={() => setActiveTab("wxapkg")}
            className={`px-6 py-3 text-base font-medium transition-all border-b-2 -mb-0.5 ${
              activeTab === "wxapkg"
                ? "text-blue-600 border-blue-600"
                : "text-muted-foreground border-transparent hover:text-blue-600"
            }`}
          >
            {t("tabs.wxapkg")}
          </button>
        </div>

        {/* Tab Panels */}
        <div className="animate-fadeIn">
          {activeTab === "python" && <PythonPanel />}
          {activeTab === "js" && <JsPanel />}
          {activeTab === "wxapkg" && <WxapkgPanel />}
        </div>

        {/* 底部原生广告 */}
        <div className="mt-16">
          <div className="text-center text-sm text-gray-400 mb-2">
            {t("sponsored")} {/* 这里会自动显示中文或英文标题 */}
          </div>
          <AdsterraNativeBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
