"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { PythonPanel } from "@/components/python-panel";
import { JsPanel } from "@/components/js-panel";
import { WxapkgPanel } from "@/components/wxapkg-panel";
import { Footer } from "@/components/footer";
import { AdsterraBanner728, AdsterraNativeBanner } from "@/components/adsterra";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"python" | "js" | "wxapkg">(
    "python"
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

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
            Python 还原
          </button>
          <button
            onClick={() => setActiveTab("js")}
            className={`px-6 py-3 text-base font-medium transition-all border-b-2 -mb-0.5 ${
              activeTab === "js"
                ? "text-blue-600 border-blue-600"
                : "text-muted-foreground border-transparent hover:text-blue-600"
            }`}
          >
            JS 反混淆
          </button>
          <button
            onClick={() => setActiveTab("wxapkg")}
            className={`px-6 py-3 text-base font-medium transition-all border-b-2 -mb-0.5 ${
              activeTab === "wxapkg"
                ? "text-blue-600 border-blue-600"
                : "text-muted-foreground border-transparent hover:text-blue-600"
            }`}
          >
            小程序解包
          </button>
        </div>

        {/* Tab Panels */}
        <div className="animate-fadeIn">
          {activeTab === "python" && <PythonPanel />}
          {activeTab === "js" && <JsPanel />}
          {activeTab === "wxapkg" && <WxapkgPanel />}
        </div>

        <div className="mt-16">
          <div className="text-center text-sm text-gray-400 mb-2">
            - 开发者资源推荐 -
          </div>
          <AdsterraNativeBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
