"use client";

import { useState } from "react";

export function Footer() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openModal = (type: "privacy" | "disclaimer" | "about") => {
    if (type === "disclaimer") {
      setModalContent({
        title: "免责声明",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            {/* 🔴 新增：核心默认同意条款 */}
            <p className="rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold">
              特别提示：访问或使用本站任何工具，即视为您已阅读并无条件同意本免责声明的所有条款。若不同意，请立即停止使用。
            </p>

            <p>
              1. <strong>仅供学习</strong>
              ：本站工具仅供技术学习、安全分析和代码审计使用。
            </p>
            <p>
              2. <strong>严禁侵权</strong>
              ：严禁用于恶意破解、去除授权验证或侵犯他人知识产权。
            </p>
            <p>
              3. <strong>免责条款</strong>
              ：使用本站工具产生的任何法律后果由用户自行承担，本站不承担责任。
            </p>
            <p>
              4. <strong>版权归属</strong>
              ：还原后的代码版权归原作者所有，本站不存储任何文件。
            </p>
            <p>
              5. <strong>服务终止</strong>
              ：若发现滥用行为，本站有权在不通知的情况下封禁 IP。
            </p>
          </div>
        ),
      });
    } else if (type === "privacy") {
      setModalContent({
        title: "隐私政策",
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>本地处理：</strong>JS
              反混淆和小程序解包均在浏览器本地完成，数据不离机。
            </p>
            <p>
              <strong>云端处理：</strong>Python
              反编译需经过服务器转发至第三方引擎，处理后立即删除，不留存文件。
            </p>
            <p>
              <strong>警告：</strong>
              请勿上传包含机密信息（如密码、密钥）的文件。
            </p>
          </div>
        ),
      });
    } else {
      setModalContent({
        title: "关于工具",
        content: (
          <div className="text-sm text-muted-foreground">
            <p>
              DevReverse
              是一个面向开发者的在线代码分析工具箱，致力于简化逆向工程流程，辅助进行代码审计与安全合规检查。
            </p>
            <p className="mt-2">联系开发者: shi510683@gmail.com</p>
          </div>
        ),
      });
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground mt-auto">
        <div className="mb-4 flex justify-center gap-6">
          <button
            onClick={() => openModal("disclaimer")}
            className="hover:text-blue-600 hover:underline"
          >
            免责声明
          </button>
          <button
            onClick={() => openModal("privacy")}
            className="hover:text-blue-600 hover:underline"
          >
            隐私政策
          </button>
          <button
            onClick={() => openModal("about")}
            className="hover:text-blue-600 hover:underline"
          >
            关于工具
          </button>
        </div>
        <div>© 2025 DevReverse · 安全分析工具</div>
        <div className="mt-2 opacity-70 text-xs">
          使用本站即代表同意免责声明
        </div>
      </footer>

      {/* 简单的 Modal 实现 */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-900 p-6 shadow-xl transform transition-all scale-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="mb-6 leading-relaxed">{modalContent.content}</div>
            <button
              onClick={() => setModalContent(null)}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              我已知晓并同意
            </button>
          </div>
        </div>
      )}
    </>
  );
}
