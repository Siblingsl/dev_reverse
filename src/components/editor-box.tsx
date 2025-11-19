'use client'

import { Loader2 } from 'lucide-react'

interface EditorBoxProps {
  code: string
  status: string
  isProcessing: boolean
  readOnly?: boolean
  onProcess: () => void
  onCopy?: () => void
  onDownload?: () => void
  onCodeChange?: (code: string) => void
  placeholder?: string
  downloadLabel?: string
  hideCopy?: boolean
  hideDownload?: boolean
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
  placeholder = '结果将显示在这里...',
  downloadLabel = '下载',
  hideCopy = false,
  hideDownload = false,
}: EditorBoxProps) {
  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isProcessing && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />}
          <span>{status}</span>
        </div>
        <div className="flex gap-2">
          {!hideCopy && onCopy && (
            <button
              onClick={onCopy}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
            >
              复制
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
            {readOnly ? '开始还原' : '格式化'}
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
  )
}
