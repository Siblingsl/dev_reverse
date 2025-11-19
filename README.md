# DevReverse - 在线代码还原工具箱 🛠️

**DevReverse** 是一个面向开发者和安全研究员的在线代码分析平台，致力于简化逆向工程流程。它集成了 Python 字节码反汇编、JavaScript 代码净化以及微信小程序包解包功能，所有核心操作均在浏览器端或通过安全代理完成。

![Project Screenshot](./public/screenshot.png)

---

## ✨ 核心功能

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
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 访问项目

打开浏览器，访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

---

## ⚖️ 免责声明

### 1. 本项目仅供学习和研究使用，请勿用于非法用途。
### 2. 使用本工具产生的任何法律后果由用户自行承担，开发者不承担责任。
### 3. 本项目中的所有代码均来源于开源社区，仅供学习和研究使用。
### 4. 禁止用于恶意破解、侵犯他人知识产权等行为。

---

License: MIT
