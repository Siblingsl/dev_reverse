import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // 验证语言是否有效
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // ✅ 修改这里：路径指向 src/messages
    // 使用 @/messages 表示从 src 根目录开始找
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
