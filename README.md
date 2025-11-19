🛠️ DevReverse - 在线代码还原工具箱

DevReverse 是一个面向安全研究员和开发者的在线辅助工具平台。它集成了 Python 字节码反汇编、JavaScript 代码净化及小程序包解包功能，旨在简化逆向工程的预处理流程。

⚠️ 郑重提示：本工具仅供技术研究与安全审计使用，严禁用于非法用途。

✨ 核心功能

🐍 1. Python 智能分析

提供两种深度的分析模式，满足不同需求：

本地反汇编 (Client-side):

基于 WebAssembly (Pyodide) 和 xdis 库。

在浏览器本地解析 .pyc 文件结构，输出汇编指令。

安全隐私：文件完全不经过服务器，适合分析敏感文件。

支持版本：Python 2.7 - 3.12。

云端深度还原 (Cloud-side):

集成 PyLingual 引擎接口。

支持 Python 3.13+ 最新版字节码的源码级还原。

注：此功能需经由服务器中转文件。

📦 2. 小程序包解包 (.wxapkg)

纯前端解析：基于浏览器二进制流处理，提取微信小程序/小游戏主包。

资源提取：自动识别并还原目录结构，提取代码 (.js, .json) 及图片资源。

一键打包：将提取后的所有文件打包为 ZIP 下载。

📜 3. JavaScript 代码净化

格式化/反混淆：针对 Webpack/Vite 等工具打包后的压缩代码 (minified code) 进行一键美化和缩进整理，便于阅读。

🏗️ 技术架构

本项目采用 Hybrid (混合) 架构，针对不同场景优化了隐私与性能：

模块

技术栈

说明

前端框架

Next.js 16 (App Router)

现代化 React 框架

UI 组件

Tailwind CSS + Shadcn UI

极简风格，响应式设计

本地运行时

Pyodide (WASM)

在浏览器运行 Python 虚拟机

边缘计算

Cloudflare Workers

用于 API 代理转发 (Edge Runtime)

部署平台

Cloudflare Pages

全球边缘网络托管

🚀 快速开始

1. 环境准备

确保本地已安装 Node.js 18+ 和 pnpm。

2. 安装与运行

# 克隆项目

git clone [https://github.com/Siblingsl/dev_reverse.git](https://github.com/Siblingsl/dev_reverse.git)
cd dev_reverse

# 安装依赖

pnpm install

# 启动开发服务器

pnpm run dev

访问 http://localhost:3000 即可使用。

☁️ 部署指南 (Cloudflare Pages)

本项目针对 Cloudflare Edge 环境进行了特殊优化。

Fork 本仓库到你的 GitHub。

登录 Cloudflare Dashboard。

进入 Workers & Pages -> Create application -> Connect to Git。

选择仓库后，配置构建参数：

Framework preset: 选择 Next.js

Build command: npx @cloudflare/next-on-pages

Output directory: .vercel/output/static

点击 Save and Deploy。

注意: API 路由已配置 export const runtime = 'edge'，可直接在 Cloudflare 免费版运行。

⚖️ 免责声明 & 隐私政策

免责声明 (Disclaimer)

本站工具仅供技术学习、安全分析和代码审计使用。

严禁使用本工具对第三方软件进行恶意破解、去除授权验证或侵犯他人知识产权。

用户使用本工具产生的任何法律后果由用户自行承担，开发者不承担任何责任。

隐私政策 (Privacy Policy)

本地处理：JS 反混淆和小程序解包功能均在浏览器本地完成，数据不上传服务器。

云端处理：Python 云端反编译功能需要将文件上传至服务器转发。本站仅做传输中转，处理完成后立即删除，绝不留存用户文件。

数据安全：请勿上传包含机密信息（如私钥、密码、Token）的文件。

🤝 贡献

欢迎提交 Issue 反馈 Bug，或提交 Pull Request 贡献代码。

License: MIT
