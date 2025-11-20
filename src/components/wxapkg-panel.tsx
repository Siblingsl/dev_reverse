"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; // 1. 引入钩子
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";
import JSZip from "jszip";
import { useSmartAd } from "@/hooks/use-smart-ad";

export function WxapkgPanel() {
  // 2. 初始化翻译命名空间
  const t = useTranslations("WxapkgPanel");
  const tCommon = useTranslations("Common");

  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState("");
  // 初始状态使用翻译文本
  const [status, setStatus] = useState(t("statusWait"));
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const { resetAdStatus, triggerAd, hasOpenedAd } = useSmartAd();

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    // 3. 使用带变量的翻译
    setStatus(
      `${tCommon("loaded", { name: uploadedFile.name })} (${(
        uploadedFile.size / 1024
      ).toFixed(1)}KB)`
    );
    resetAdStatus();
    setLog("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const parseWxapkg = async (file: File) => {
    const logs: string[] = [];
    const addLog = (msg: string) => logs.push(msg);

    try {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const uint8 = new Uint8Array(buffer);
      const decoder = new TextDecoder("utf-8");

      const firstMark = view.getUint8(0);
      const lastMark = view.getUint8(13);

      if (firstMark !== 0xbe || lastMark !== 0xed) {
        throw new Error("Invalid Header (Magic Number Mismatch)");
      }

      addLog("[INFO] Header Check: OK (0xBEBAFECA detected)");

      const fileCount = view.getUint32(14);
      addLog(`[INFO] File Count: ${fileCount}`);
      addLog(`[INFO] Reading Index Table...`);

      const zip = new JSZip();
      let offset = 18;

      for (let i = 0; i < fileCount; i++) {
        const nameLen = view.getUint32(offset);
        offset += 4;

        const nameBytes = uint8.slice(offset, offset + nameLen);
        const name = decoder.decode(nameBytes);
        offset += nameLen;

        const fileOffset = view.getUint32(offset);
        offset += 4;

        const fileSize = view.getUint32(offset);
        offset += 4;

        const fileContent = uint8.slice(fileOffset, fileOffset + fileSize);

        const cleanName = name.startsWith("/") ? name.slice(1) : name;
        zip.file(cleanName, fileContent);

        if (i < 5 || i > fileCount - 5) {
          addLog(`[EXTRACT] ${cleanName} (${fileSize} bytes)`);
        } else if (i === 5) {
          addLog(
            `[EXTRACT] ... (skipping logs for ${fileCount - 10} files) ...`
          );
        }
      }

      addLog(`[SUCCESS] All ${fileCount} files extracted successfully.`);
      addLog(`[INFO] Packing into ZIP...`);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      setDownloadUrl(url);

      addLog(`[DONE] Ready to download.`);
      return logs.join("\n");
    } catch (e) {
      throw new Error(
        e instanceof Error ? e.message : "Unknown error during parsing"
      );
    }
  };

  const handleProcess = async () => {
    if (!file) {
      // 错误信息翻译
      setStatus(tCommon("error", { msg: "No file selected" }));
      return;
    }

    setIsProcessing(true);
    setStatus(t("statusParsing")); // "正在解析二进制结构..."
    setLog("Start parsing...");

    try {
      await new Promise((r) => requestAnimationFrame(r));

      const resultLog = await parseWxapkg(file);
      setLog(resultLog);
      setStatus(t("statusDone")); // "✅ 解析完成！请点击右侧下载按钮 👉"
    } catch (error) {
      console.error(error);
      setStatus(tCommon("error", { msg: (error as Error).message }));
      setLog(`[ERROR] ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    triggerAd();
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${file?.name || "wxapkg"}_unpacked.zip`;
    a.click();
  };

  return (
    <div
      onClick={() => {
        if ((log || downloadUrl) && !hasOpenedAd) triggerAd();
      }}
    >
      <div className="mb-5 text-center">
        {/* 4. 标题和副标题翻译 */}
        <h2 className="mb-2 text-2xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <UploadZone
        icon="📦"
        // 5. 上传区域翻译
        title={t("uploadTitle")}
        subtitle={t("uploadSubtitle")}
        accept=".wxapkg"
        onFileSelect={handleFile}
      />

      <EditorBox
        code={log}
        status={status}
        isProcessing={isProcessing}
        readOnly
        onProcess={handleProcess}
        onDownload={handleDownload}
        // 6. 编辑器占位符翻译
        placeholder={t("placeholder")}
        // 7. 按钮翻译
        downloadLabel={t("btnDownloadZip")} // "下载提取包 (ZIP)"
        processLabel={t("btnStart")} // 注意：需要在 json 里加 "btnStart": "开始解析"
        hideCopy
      />
    </div>
  );
}
