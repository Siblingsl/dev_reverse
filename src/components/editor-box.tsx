"use client";

import { Loader2 } from "lucide-react";

interface EditorBoxProps {
  code: string;
  status: string;
  isProcessing: boolean;
  readOnly?: boolean;
  onProcess: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onCodeChange?: (code: string) => void;
  // 👇 文本 Props
  placeholder?: string;
  downloadLabel?: string;
  copyLabel?: string; // ✨ 新增: 复制按钮文字
  processLabel?: string; // ✨ 新增: 处理按钮文字 (开始还原/格式化)
  // 👇 控制开关
  hideCopy?: boolean;
  hideDownload?: boolean;
}

export function EditorBox({
  code,
  status,
  isProcessing,
  readOnly = false,
  onProcess,
  onCopy,
  onDownload,
  onCodeChange,
  placeholder = "结果将显示在这里...",
  // 👇 设置默认值 (作为后备，防止父组件没传时显示空白)
  downloadLabel = "下载",
  copyLabel = "复制",
  processLabel, // 不设默认值，下面动态计算
  hideCopy = false,
  hideDownload = false,
}: EditorBoxProps) {
  // ✨ 计算主按钮的文字
  // 如果父组件传了 processLabel，就用传进来的；
  // 如果没传，就根据 readOnly 状态显示默认中文 (兼容旧代码)
  const finalProcessLabel = processLabel || (readOnly ? "开始还原" : "格式化");

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isProcessing && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
          )}
          <span>{status}</span>
        </div>
        <div className="flex gap-2">
          {!hideCopy && onCopy && (
            <button
              onClick={onCopy}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
            >
              {/* ✨ 使用变量 */}
              {copyLabel}
            </button>
          )}
          {!hideDownload && onDownload && (
            <button
              onClick={onDownload}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
            >
              {downloadLabel}
            </button>
          )}
          <button
            onClick={onProcess}
            disabled={isProcessing}
            className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* ✨ 使用变量 */}
            {finalProcessLabel}
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={code}
        onChange={(e) => onCodeChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        className="flex-1 resize-none border-none bg-card px-5 py-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
