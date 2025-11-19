# DevReverse - 在线代码还原工具箱 🛠️

**DevReverse** 是一个面向开发者和安全研究员的在线代码分析平台，致力于简化逆向工程流程。它集成了 Python 字节码反汇编、JavaScript 代码净化以及微信小程序包解包功能，所有核心操作均在浏览器端或通过安全代理完成。

![Project Screenshot](./public/screenshot.png) ## ✨ 核心功能

### 1. 🐍 Python 智能反编译 & 反汇编

- **纯前端反汇编**：基于 **WebAssembly (Pyodide)** 和 **xdis** 库，在浏览器本地解析 `.pyc` 文件，支持 Python 2.7 - 3.12 跨版本指令集分析。
- **智能源码还原**：集成远程引擎，支持 Python 3.13+ 最新版字节码的深度还原（需后端代理）。

### 2. 📜 JavaScript 代码净化

- **反混淆/格式化**：一键美化 Webpack/Vite 打包后的压缩代码。
- **AST 分析**：(未来计划) 支持变量重命名和逻辑还原。

### 3. 📦 小程序包结构分析

- **.wxapkg 解包**：纯前端二进制流解析，无需上传文件。
- **资源提取**：自动识别并提取包内的图片、配置 JSON 和代码文件。
- **一键下载**：支持将提取内容打包为 ZIP 下载。

---

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Shadcn UI (风格)
- **运行时**:
  - **Client**: Pyodide (WASM Python), JSZip, js-beautify
  - **Edge**: Cloudflare Workers (用于 API 代理)
- **部署**: Cloudflare Pages

---

## 🚀 快速开始

### 1. 环境准备

确保你安装了 Node.js 18+ 和 pnpm (推荐)。

```bash
# 克隆项目
git clone [https://github.com/Siblingsl/dev_reverse.git](https://github.com/Siblingsl/dev_reverse.git)
cd dev_reverse

# 安装依赖
pnpm install
2. 启动开发服务器
Bash

pnpm run dev
访问 http://localhost:3000 即可看到效果。

3. 构建与部署 (Cloudflare Pages)
本项目针对 Cloudflare Pages 进行了优化（使用了 Edge Runtime）。

部署步骤：

将代码推送到 GitHub。

在 Cloudflare Dashboard 中创建 Pages 项目并连接仓库。

构建配置：

Framework Preset: Next.js

Build Command: npx @cloudflare/next-on-pages

Output Directory: .vercel/output/static

点击部署即可。

⚖️ 免责声明 (Disclaimer)
仅供学习：本工具仅供技术学习、安全分析和代码审计使用。

严禁侵权：严禁用于恶意破解、去除授权验证或侵犯他人知识产权。

责任界定：使用本工具产生的任何法律后果由用户自行承担，开发者不承担责任。

数据隐私：

本地工具（JS/Wxapkg）数据完全在浏览器处理。

在线反编译（Python）功能需经服务器中转，请勿上传包含机密信息（如密钥、密码）的文件。

🤝 贡献
欢迎提交 Issue 或 Pull Request 来改进这个项目！

License: MIT
```
