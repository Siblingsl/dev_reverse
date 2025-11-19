"use client";

import { useState, useEffect } from "react";
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";

export function JsPanel() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("就绪");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target?.result as string);
      setStatus(`已加载: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    if (!code) {
      setStatus("错误: 内容为空");
      return;
    }

    setIsProcessing(true);
    setStatus("正在格式化...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use js-beautify if available
      if (typeof window !== "undefined" && (window as any).js_beautify) {
        const beautified = (window as any).js_beautify(code, {
          indent_size: 2,
        });
        setCode(beautified);
        setStatus("格式化完成");
      } else {
        setStatus("错误: Beautify library not loaded");
      }
    } catch (error) {
      setStatus("错误: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setStatus("已复制到剪贴板");
    setTimeout(() => setStatus("就绪"), 2000);
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="mb-2 text-2xl font-semibold">JavaScript 代码净化</h2>
        <p className="text-sm text-muted-foreground">
          格式化、反混淆 Webpack 打包后的 JS 代码。
        </p>
      </div>

      <UploadZone
        icon="📜"
        title="点击上传文件，或直接在下方粘贴代码"
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
        onCodeChange={setCode}
        placeholder="在此粘贴混淆的 JS 代码..."
        hideDownload
      />
    </div>
  );
}
