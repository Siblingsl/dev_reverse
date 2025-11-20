"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Languages, Check, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languageMap = {
    zh: "中文",
    en: "English",
  };

  // 切换语言逻辑
  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮：平时透明，hover变灰，更精致 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none ${
          isOpen ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        }`}
      >
        <Languages className="h-4 w-4" />
        <span>{languageMap[locale as keyof typeof languageMap]}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 下拉菜单：绝对定位，带阴影和边框 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 z-50 bg-white dark:bg-slate-950">
          {Object.entries(languageMap).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleSwitch(key)}
              className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                locale === key ? "bg-accent/50 text-accent-foreground" : ""
              }`}
            >
              {/* 选中状态显示打钩图标 */}
              {locale === key && (
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check className="h-4 w-4 text-blue-600" />
                </span>
              )}
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}