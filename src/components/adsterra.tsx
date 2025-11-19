"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

// 1. 顶部 728x90 横幅 (保持原样，逻辑没问题)
export function AdsterraBanner728() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");

      conf.type = "text/javascript";
      conf.innerHTML = `
        atOptions = {
            'key' : '36ef9f293426468c4d2cfc70a53d905c',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
        };
      `;

      script.type = "text/javascript";
      script.src =
        "//www.highperformanceformat.com/36ef9f293426468c4d2cfc70a53d905c/invoke.js";

      if (bannerRef.current) {
        bannerRef.current.append(conf);
        bannerRef.current.append(script);
      }
    }
  }, []);

  return (
    <div
      className="flex justify-center my-4 overflow-hidden"
      style={{ minHeight: "90px" }}
    >
      <div ref={bannerRef} />
    </div>
  );
}

// 2. 底部原生广告 (已修复 Script 标签和 Flex 布局)
export function AdsterraNativeBanner() {
  return (
    <div className="w-full my-8 flex flex-col items-center">
      {/* 这里的文字标签建议保留，我加了 flex-col 确保它在广告上方 */}
      <div className="text-xs text-gray-400 mb-2 text-center tracking-widest">
        - SPONSORED / 推荐资源 -
      </div>

      <div
        className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: "90px",
          minWidth: "300px", // 给个最小宽度，防止没加载时缩成一团
        }}
      >
        <div id="container-5bac8ea9bbdced29e6a46b214d1ef492"></div>

        {/* 修复：使用 Next.js 的 Script 组件 */}
        <Script
          src="//pl28086588.effectivegatecpm.com/5bac8ea9bbdced29e6a46b214d1ef492/invoke.js"
          strategy="lazyOnload" // 懒加载，不影响工具使用
          data-cfasync="false"
        />
      </div>
    </div>
  );
}

// 3. 社交条悬浮窗 (已修复 Script 标签)
export function AdsterraSocialBar() {
  return (
    <Script
      src="//pl28086754.effectivegatecpm.com/eb/9c/c8/eb9cc8b78aaa3c27b385d4b37ff9fe54.js"
      strategy="afterInteractive"
      data-cfasync="false"
      type="text/javascript"
    />
  );
}
