"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; // 1. 引入钩子
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";
import { useSmartAd } from "@/hooks/use-smart-ad";

export function JsPanel() {
  // 2. 初始化翻译命名空间
  const t = useTranslations("JsPanel");
  const tCommon = useTranslations("Common");

  const [code, setCode] = useState("");
  // 初始状态使用翻译文本
  const [status, setStatus] = useState(t("statusWait"));
  const [isProcessing, setIsProcessing] = useState(false);

  const { resetAdStatus, triggerAd, hasOpenedAd } = useSmartAd();

  const handleFile = (file: File) => {
    resetAdStatus();
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target?.result as string);
      // 3. 使用带参数的翻译
      setStatus(tCommon("loaded", { name: file.name }));
    };
    reader.readAsText(file);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (newCode === "") resetAdStatus();
  };

  const handleProcess = async () => {
    if (!code) {
      // 这里也可以添加对应的翻译 key，暂时复用 empty error
      setStatus(tCommon("error", { msg: "Content is empty" }));
      return;
    }

    setIsProcessing(true);
    setStatus(t("statusFormat")); // "正在格式化..."

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (typeof window !== "undefined" && (window as any).js_beautify) {
        const beautified = (window as any).js_beautify(code, {
          indent_size: 2,
        });
        setCode(beautified);
        setStatus(t("statusDone")); // "格式化完成"
      } else {
        setStatus(tCommon("error", { msg: "Beautify library not loaded" }));
      }
    } catch (error) {
      setStatus(tCommon("error", { msg: (error as Error).message }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    triggerAd();

    navigator.clipboard.writeText(code);
    setStatus(tCommon("copied")); // "已复制到剪贴板"
    setTimeout(() => setStatus(t("statusWait")), 2000);
  };

  return (
    <div
      onClick={() => {
        if (code && !hasOpenedAd) triggerAd();
      }}
    >
      <div className="mb-5 text-center">
        {/* 4. 标题和副标题翻译 */}
        <h2 className="mb-2 text-2xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <UploadZone
        icon="📜"
        // 5. 上传区域翻译
        title={t("uploadTitle")}
        accept=".js"
        onFileSelect={handleFile}
        compact
      />

      <EditorBox
        code={code}
        status={status}
        isProcessing={isProcessing}
        onProcess={handleProcess}
        onCopy={handleCopy}
        onCodeChange={handleCodeChange}
        // 6. 编辑器占位符翻译
        placeholder={t("placeholder")}
        hideDownload
        // 7. 传入按钮翻译文本
        copyLabel={tCommon("copy")}
        // 注意：JS 面板的按钮通常是“格式化”，这里你可以传入自定义的 key
        // 或者如果 messages 里没定义 specific key，就用默认的 processLabel 逻辑
        // 这里我们用 'statusFormat' 对应的动词，或者新增一个 btnFormat 键值
        // 简单起见，这里暂时硬编码或者去 json 里加一个 "btnFormat": "格式化"
        processLabel={t("statusFormat").replace("...", "")} // 临时方案：用 "正在格式化" 去掉点点点
        // 更好的方案是在 JsPanel json 里加 "btnFormat": "格式化" / "Format"
      />
    </div>
  );
}
