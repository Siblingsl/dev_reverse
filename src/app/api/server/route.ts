import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// 1. 定义上游接口地址 (使用 api 子域名)
const UPLOAD_URL = "https://api.pylingual.io/upload";
const RESULT_API_BASE = "https://api.pylingual.io/view_chimera";

// 2. 辅助函数：生成高度逼真的随机浏览器 Headers
// 这能有效对抗 Cloudflare 的指纹识别
function getFakeHeaders() {
  // 随机版本号 (Chrome 120-124)
  const version = Math.floor(Math.random() * 5) + 120;
  // 随机平台 (Windows / Macintosh)
  const isWin = Math.random() > 0.5;
  const platform = isWin ? '"Windows"' : '"macOS"';

  const userAgent = isWin
    ? `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`
    : `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;

  const secChUa = isWin
    ? `"Google Chrome";v="${version}", "Not=A?Brand";v="24", "Chromium";v="${version}"`
    : `"Google Chrome";v="${version}", "Not=A?Brand";v="24", "Chromium";v="${version}"`;

  return {
    // 核心伪装
    "User-Agent": userAgent,
    Origin: "https://pylingual.io",
    Referer: "https://pylingual.io/",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",

    // 高级指纹 (Client Hints)
    "Sec-Ch-Ua": secChUa,
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": platform,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site", // 因为我们伪造了 Origin，所以声明为同站

    // 缓存控制
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Connection: "keep-alive",
  };
}

export async function POST(request: NextRequest) {
  try {
    // --- 步骤 1: 获取前端文件 ---
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`[Proxy] Uploading to ${UPLOAD_URL}...`);

    // --- 步骤 2: 构造上传请求 ---
    const forwardData = new FormData();
    forwardData.append("file", file);
    // 补充 fileName 字段，模拟真实网页行为
    forwardData.append("fileName", file.name);

    // 生成本次会话的伪造 Headers
    const fakeHeaders = getFakeHeaders();

    // 发起上传
    const uploadResponse = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: fakeHeaders, // 使用伪造头
      body: forwardData,
    });

    // 检查非 JSON 响应 (这是最容易出错的地方)
    const contentType = uploadResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await uploadResponse.text();
      console.error(
        `[Proxy Error] Upstream returned non-JSON (${uploadResponse.status}):`,
        text.slice(0, 200)
      );

      // 如果返回 HTML，通常是被 WAF 拦截了
      if (text.includes("Cloudflare") || text.includes("Just a moment")) {
        throw new Error("Request blocked by Cloudflare protection.");
      }
      throw new Error(`Upstream API returned ${contentType} instead of JSON.`);
    }

    if (!uploadResponse.ok) {
      throw new Error(`Upload Failed: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log("[Proxy] Upload Response:", uploadResult);

    // --- 步骤 3: 提取 ID 并等待 ---
    const fileId = uploadResult.identifier;
    if (!fileId) {
      throw new Error("No identifier in response");
    }

    // 随机等待 1.5s - 2.5s，既防止结果未就绪，也模拟人类行为
    const waitTime = 1500 + Math.random() * 1000;
    await new Promise((r) => setTimeout(r, waitTime));

    // --- 步骤 4: 获取最终结果 ---
    const resultUrl = `${RESULT_API_BASE}?identifier=${fileId}`;
    console.log(`[Proxy] Fetching result from ${resultUrl}...`);

    const resultResponse = await fetch(resultUrl, {
      method: "GET",
      headers: fakeHeaders, // 复用同一个 User-Agent，保持会话一致性
    });

    if (!resultResponse.ok) {
      throw new Error(`Result Fetch Failed: ${resultResponse.status}`);
    }

    const finalData = await resultResponse.json();
    return NextResponse.json(finalData);
  } catch (error) {
    console.error("[Proxy Error]:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
