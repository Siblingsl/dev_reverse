"use client";
import Script from "next/script";

export function AdsterraNativeBanner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "20px 0",
        minHeight: "90px",
      }}
    >
      {/* 1. 容器必须先存在 */}
      <div id="container-5bac8ea9bbdced29e6a46b214d1ef492"></div>

      {/* 2. 脚本后加载 */}
      <script
        async
        data-cfasync="false"
        src="//pl28086588.effectivegatecpm.com/5bac8ea9bbdced29e6a46b214d1ef492/invoke.js"
      ></script>
    </div>
  );
}

export function AdsterraSocialBar() {
  return (
    <script
      data-cfasync="false"
      type="text/javascript"
      src="//pl28086754.effectivegatecpm.com/eb/9c/c8/eb9cc8b78aaa3c27b385d4b37ff9fe54.js"
    ></script>
  );
}
