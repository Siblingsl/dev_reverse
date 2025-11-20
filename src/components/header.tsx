import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher"; // 引入新组件

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-5">
        {/* Logo 部分 */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight flex items-center gap-2"
        >
          {/* 如果有 logo 图片可以放这里 */}
          <span>
            Dev<span className="text-blue-600">Reverse</span>
          </span>
        </Link>

        {/* 右侧：直接放入漂亮的切换器 */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
