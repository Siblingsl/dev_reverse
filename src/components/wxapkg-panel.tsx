"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";
import JSZip from "jszip"; // 📦 引入 JSZip

export function WxapkgPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [log, setLog] = useState("");
  const [status, setStatus] = useState("等待文件...");
  const [isProcessing, setIsProcessing] = useState(false);
  // 用于存储生成的 zip Blob，以便下载
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus(
      `已加载: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(
        1
      )}KB)`
    );
    setLog(""); // 清空日志
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  // 🔍 核心：Wxapkg 解析逻辑
  const parseWxapkg = async (file: File) => {
    const logs: string[] = [];
    const addLog = (msg: string) => logs.push(msg);

    try {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const uint8 = new Uint8Array(buffer);
      const decoder = new TextDecoder("utf-8");

      // 1. 检查 Magic Number (0xBEBAFECA)
      const firstMark = view.getUint8(0);
      const info1 = view.getUint32(1); // info1 unused
      const indexInfoLength = view.getUint32(5);
      const bodyInfoLength = view.getUint32(9);
      const lastMark = view.getUint8(13);

      if (firstMark !== 0xbe || lastMark !== 0xed) {
        throw new Error("文件头校验失败，这不是有效的 .wxapkg 文件");
      }

      addLog("[INFO] Header Check: OK (0xBEBAFECA detected)");

      // 2. 读取文件列表数量
      const fileCount = view.getUint32(14);
      addLog(`[INFO] File Count: ${fileCount}`);
      addLog(`[INFO] Reading Index Table...`);

      const zip = new JSZip();
      let offset = 18; // 从 14 + 4 开始读取文件列表

      // 3. 遍历文件索引并提取
      for (let i = 0; i < fileCount; i++) {
        // 读取文件名长度
        const nameLen = view.getUint32(offset);
        offset += 4;

        // 读取文件名
        const nameBytes = uint8.slice(offset, offset + nameLen);
        const name = decoder.decode(nameBytes);
        offset += nameLen;

        // 读取文件偏移量
        const fileOffset = view.getUint32(offset);
        offset += 4;

        // 读取文件大小
        const fileSize = view.getUint32(offset);
        offset += 4;

        // 提取文件内容
        const fileContent = uint8.slice(fileOffset, fileOffset + fileSize);

        // 添加到 ZIP
        // 去掉文件名前面的 "/"，否则解压可能会有问题
        const cleanName = name.startsWith("/") ? name.slice(1) : name;
        zip.file(cleanName, fileContent);

        // 只打印前5个和后5个文件，避免日志太长
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

      // 4. 生成 ZIP 文件
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      setDownloadUrl(url);

      addLog(`[DONE] Ready to download.`);
      return logs.join("\n");
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "解析过程发生未知错误");
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setStatus("错误: 请先上传文件");
      return;
    }

    setIsProcessing(true);
    setStatus("正在解析二进制结构...");
    setLog("Start parsing...");

    try {
      // 稍微延迟一下让 UI 渲染 "正在解析" 状态
      await new Promise((r) => requestAnimationFrame(r));

      const resultLog = await parseWxapkg(file);
      setLog(resultLog);
      setStatus("✅ 解析完成！请点击右侧“下载提取包 (ZIP)”按钮下载资源包 👉");
    } catch (error) {
      console.error(error);
      setStatus("错误: " + (error as Error).message);
      setLog(`[ERROR] ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${file?.name || "wxapkg"}_unpacked.zip`;
    a.click();
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="mb-2 text-2xl font-semibold">小程序包结构分析</h2>
        <p className="text-sm text-muted-foreground">
          真实解析 .wxapkg 二进制文件，提取所有资源并打包下载。
        </p>
      </div>

      <UploadZone
        icon="📦"
        title="点击上传 .wxapkg 文件"
        subtitle="支持微信小程序、小游戏包文件"
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
        placeholder="解析日志将显示在这里..."
        downloadLabel="下载提取包 (ZIP)"
        hideCopy
      />
    </div>
  );
}
