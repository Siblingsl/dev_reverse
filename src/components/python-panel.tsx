"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";
import { EditorBox } from "@/components/editor-box";

export function PythonPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("等待上传文件...");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus(`已加载: ${uploadedFile.name}`);
    // 每次选择新文件时清空旧代码
    setCode("");
  };

  const handleProcess = async () => {
    if (!file) {
      setStatus("错误: 请先选择文件");
      return;
    }

    // ============================================================
    // 🕒 新增：频率限制逻辑 (Rate Limiting)
    // ============================================================
    const STORAGE_KEY = "pylingual_last_usage";
    const COOLDOWN_SEC = 60; // 冷却时间：60秒

    // 1. 获取上次使用时间
    const lastUsage = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();
    const elapsedSeconds = (now - lastUsage) / 1000;

    // 2. 判断是否还在冷却中
    if (elapsedSeconds < COOLDOWN_SEC) {
      const remaining = Math.ceil(COOLDOWN_SEC - elapsedSeconds);
      setStatus(`请求过于频繁，请等待 ${remaining} 秒后再试 ☕`);
      return; // 直接阻断请求
    }

    // 3. 记录本次使用时间 (在发起请求前记录，防止并发点击)
    localStorage.setItem(STORAGE_KEY, now.toString());

    setIsProcessing(true);
    setStatus("正在上传并分析...");
    setCode(""); // 清空之前的结果

    try {
      // 1. 准备表单数据
      const formData = new FormData();
      formData.append("file", file);

      // 2. 请求我们自己的 Next.js 后端 API (代理)
      // 注意：这里不需要写完整的 https://...，用相对路径即可
      const response = await fetch("/api/server", {
        method: "POST",
        body: formData,
      });

      // 3. 处理 HTTP 错误
      if (!response.ok) {
        // 尝试读取文本内容，因为可能返回的是 HTML 报错页面
        const text = await response.text();
        let errorMsg = `请求失败: ${response.status} ${response.statusText}`;

        try {
          // 尝试解析 JSON 错误信息
          const json = JSON.parse(text);
          if (json.error) errorMsg = json.error;
        } catch (e) {
          // 如果不是 JSON，说明返回了 HTML 页面（比如 404 或 500）
          console.error("非 JSON 响应:", text.slice(0, 500)); // 打印前500个字符看看是啥
          errorMsg = `服务器返回了非预期格式 (可能路径错误或服务器崩溃)`;
        }

        throw new Error(errorMsg);
      }

      // 4. 获取最终 JSON 结果
      const result = await response.json();

      // 5. 提取源码
      // 根据你提供的 JSON 结构：root -> editor_content -> file_raw_python -> editor_content
      let sourceCode = result?.editor_content?.file_raw_python?.editor_content;

      if (sourceCode) {
        // 🧹 新增：清理头部元数据注释
        // 我们把字符串按行分割，过滤掉不想显示的行，再重新拼接回去
        sourceCode = sourceCode
          .split("\n")
          .filter((line: string) => {
            const t = line.trim();
            // 过滤掉包含特定关键词的注释行
            return !(
              t.startsWith("# Decompiled with PyLingual") ||
              t.startsWith("# Internal filename:") ||
              t.startsWith("# Bytecode version:") ||
              t.startsWith("# Source timestamp:")
            );
          })
          .join("\n")
          .trim(); // 去除首尾多余的空白字符

        setCode(sourceCode);
        setStatus("反编译成功！");
      } else {
        console.error("无法解析返回结果:", result);
        setStatus("错误: 服务端返回了无法识别的数据格式");
        setCode(JSON.stringify(result, null, 2)); // 调试用：把原始 JSON 显示出来
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`错误: ${errorMessage}`);
      setCode(`[Error Log]\n${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setStatus("已复制到剪贴板");
    setTimeout(() => setStatus("反编译成功！"), 2000);
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pyc", "")}_decompiled.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
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
        readOnly={true} // 结果通常只读，或者是可编辑的源码
        onProcess={handleProcess}
        onCopy={handleCopy}
        onDownload={handleDownload}
        placeholder="反编译后的源代码将显示在这里..."
        downloadLabel="下载源码"
      />
    </div>
  );
}
