import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation"; // ✅ 新的

export const routing = defineRouting({
  // 支持的语言
  locales: ["en", "zh"],
  // 默认语言
  defaultLocale: "zh",
});

// 导出轻量级的导航工具（用于Link和Router）
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
