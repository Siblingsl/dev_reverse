"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";
import { useSmartAd } from "@/hooks/use-smart-ad";

const SMARTLINK_URL =
  "https://www.effectivegatecpm.com/uf4hx791f?key=95ad2f2d7ede996ba864dd8afeafef89";

export function PythonPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("等待上传文件...");
  const [isProcessing, setIsProcessing] = useState(false);

  const { resetAdStatus, triggerAd, hasOpenedAd } = useSmartAd();

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus(`已加载: ${uploadedFile.name}`);
    setCode("");
    resetAdStatus();
  };

  const handleProcess = async () => {
    if (!file) {
      setStatus("错误: 请先选择文件");
      return;
    }

    // ... (频率限制逻辑保持不变) ...
    const STORAGE_KEY = "pylingual_last_usage";
    const COOLDOWN_SEC = 60;
    const lastUsage = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();
    const elapsedSeconds = (now - lastUsage) / 1000;

    if (elapsedSeconds < COOLDOWN_SEC) {
      const remaining = Math.ceil(COOLDOWN_SEC - elapsedSeconds);
      setStatus(`请求过于频繁，请等待 ${remaining} 秒后再试 ☕`);
      return;
    }
    localStorage.setItem(STORAGE_KEY, now.toString());

    setIsProcessing(true);
    setStatus("正在上传并分析...");
    setCode("");

    resetAdStatus();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/server", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `请求失败: ${response.status} ${response.statusText}`;
        try {
          const json = JSON.parse(text);
          if (json.error) errorMsg = json.error;
        } catch (e) {
          errorMsg = `服务器返回了非预期格式`;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      let sourceCode = result?.editor_content?.file_raw_python?.editor_content;

      if (sourceCode) {
        sourceCode = sourceCode
          .split("\n")
          .filter((line: string) => {
            const t = line.trim();
            return !(
              t.startsWith("# Decompiled with PyLingual") ||
              t.startsWith("# Internal filename:") ||
              t.startsWith("# Bytecode version:") ||
              t.startsWith("# Source timestamp:")
            );
          })
          .join("\n")
          .trim();

        setCode(sourceCode);
        setStatus("反编译成功！");
      } else {
        setStatus("错误: 服务端返回了无法识别的数据格式");
        setCode(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`错误: ${errorMessage}`);
      setCode(`[Error Log]\n${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;

    // ✨ 5. 在复制前尝试触发广告
    triggerAd();

    navigator.clipboard.writeText(code);
    setStatus("已复制到剪贴板");
    setTimeout(() => setStatus("反编译成功！"), 2000);
  };

  const handleDownload = () => {
    if (!code) return;

    // ✨ 6. 在下载前尝试触发广告
    triggerAd();

    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pyc", "")}_decompiled.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={() => {
        if (code && !hasOpenedAd) triggerAd();
      }}
    >
      <div className="mb-5 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Python 智能反编译</h2>
        <p className="text-sm text-muted-foreground">
          通过云端引擎进行深度还原，支持 Python 3.13+ 及其它高版本。
        </p>
      </div>

      <UploadZone
        icon="☁️"
        title="点击上传 .pyc 文件"
        subtitle="文件将上传至服务器进行分析，支持全版本"
        accept=".pyc"
        onFileSelect={handleFile}
      />

      <EditorBox
        code={code}
        status={status}
        isProcessing={isProcessing}
        readOnly={true}
        onProcess={handleProcess}
        onCopy={handleCopy}
        onDownload={handleDownload}
        placeholder="反编译后的源代码将显示在这里..."
        downloadLabel="下载源码"
      />
    </div>
  );
}
