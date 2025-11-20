"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; // 👈 1. 引入 Hook
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";
import { useSmartAd } from "@/hooks/use-smart-ad";

export function PythonPanel() {
  // 👈 2. 初始化翻译命名空间
  // 我们需要用到 "PythonPanel" 和 "Common" 两个命名空间
  const t = useTranslations("PythonPanel");
  const tCommon = useTranslations("Common");

  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");

  // 初始化状态使用翻译键值 (或者设为空，由 UI 层处理默认值)
  // 这里为了简单，初始状态还是先用 key，渲染时再翻译，或者直接用 state 存状态码
  // 但为了不破坏你现有的 EditorBox 逻辑，我们先把初始文本换成翻译后的
  const [status, setStatus] = useState(t("statusWait"));
  const [isProcessing, setIsProcessing] = useState(false);

  const { resetAdStatus, triggerAd, hasOpenedAd } = useSmartAd();

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    // 👈 3. 使用带变量的翻译
    setStatus(tCommon("loaded", { name: uploadedFile.name }));
    setCode("");
    resetAdStatus();
  };

  const handleProcess = async () => {
    if (!file) {
      // 👈 4. 错误信息翻译
      setStatus(tCommon("error", { msg: t("statusWait") })); // "请先选择文件" 暂时复用等待文案或加新key
      return;
    }

    const STORAGE_KEY = "pylingual_last_usage";
    const COOLDOWN_SEC = 60;
    const lastUsage = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();
    const elapsedSeconds = (now - lastUsage) / 1000;

    if (elapsedSeconds < COOLDOWN_SEC) {
      const remaining = Math.ceil(COOLDOWN_SEC - elapsedSeconds);
      // 这里如果是动态生成的文本，暂时保留或添加到 json 中
      setStatus(`Wait ${remaining}s...`);
      return;
    }
    localStorage.setItem(STORAGE_KEY, now.toString());

    setIsProcessing(true);
    setStatus("Uploading..."); // 可以添加到 json: "statusUploading"
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
        let errorMsg = `HTTP ${response.status}`;
        try {
          const json = JSON.parse(text);
          if (json.error) errorMsg = json.error;
        } catch (e) {
          errorMsg = "Server Error";
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
        setStatus("Success!"); // 可以添加到 json: "statusSuccess"
      } else {
        setStatus(tCommon("error", { msg: "Invalid Data" }));
        setCode(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown Error";
      setStatus(tCommon("error", { msg: errorMessage }));
      setCode(`[Error Log]\n${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;

    triggerAd();

    navigator.clipboard.writeText(code);
    setStatus(tCommon("copied"));
    setTimeout(() => setStatus("Success!"), 2000);
  };

  const handleDownload = () => {
    if (!code) return;

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
        {/* 👈 5. 标题和副标题翻译 */}
        <h2 className="mb-2 text-2xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <UploadZone
        icon="☁️"
        // 👈 6. 上传区域文案翻译
        title={t("uploadTitle")}
        subtitle={t("uploadSubtitle")}
        accept=".pyc"
        onFileSelect={handleFile}
      />

      <EditorBox
        code={code}
        status={status} // status 现在是翻译后的字符串
        isProcessing={isProcessing}
        readOnly={true}
        onProcess={handleProcess}
        onCopy={handleCopy}
        onDownload={handleDownload}
        // 👈 7. 编辑器文案翻译
        placeholder={t("placeholder")}
        downloadLabel={tCommon("download")}
        // 注意：EditorBox 组件内部的 "复制" 和 "开始还原" 按钮
        // 如果 EditorBox 没开放 label 属性，你需要去修改 EditorBox 组件本身
        // 或者在这里传入翻译好的 label，例如：
        copyLabel={tCommon("copy")}
        processLabel={t("btnStart")}
      />
    </div>
  );
}
