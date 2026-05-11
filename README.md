# ◈ NEXUS AI CIVILIZATION

> **下一代 AI 数字文明操作系统**
>
> 面向未来 AI 时代的人类能力与智能协作操作系统原型

***

## 🎯 核心定位

这不是普通的网站。

而是：**未来 AI 文明世界的操作系统原型**

当用户进入后，不再是浏览网页，而是**进入未来 AI 世界**。

## ✨ 核心特性

| 模块                          | 描述                             |
| --------------------------- | ------------------------------ |
| **Cinematic Boot Sequence** | 沉浸式系统启动序列，模拟未来科技系统启动体验         |
| **AI Thought Stream**       | 实时 AI 意识流可视化，展示系统思考过程          |
| **Agent Galaxy**            | 多智能体协作宇宙，展示 AI Agent 间的实时通信与协作 |
| **Civilization Timeline**   | AI 文明演进时间轴，从 2025 到 2035 的科幻叙事 |
| **Global Heat Map**         | 全球 AI 活动热力图，展示 20 个核心城市的智能体分布  |
| **Skill Evolution Tree**    | 人类×AI 技能进化树，动态能量流动可视化          |
| **AI City System**          | Three.js 3D 数据城市，建筑间数据流动       |
| **AI Oracle**               | 自然语言查询接口，动态推理链路可视化             |
| **Command Center**          | 企业级 AI 指挥中心，实时监控面板             |

## 🛠️ 技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXUS AI CIVILIZATION                    │
├─────────────────────────────────────────────────────────────┤
│  Framework:     Next.js 14 + React 18                       │
│  Language:      TypeScript 5.4 (strict mode)                │
│  Styling:       TailwindCSS 3.4 + Custom Design System      │
│  Animation:     Framer Motion + GSAP                        │
│  3D/Visualization: Three.js + React Three Fiber            │
│  Icons:         Lucide React                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.17.0
- npm >= 9.6.7

### 安装与运行

```bash
# 克隆仓库
git clone <repository-url>
cd nexus-ai-civilization

# 安装依赖
npm install

# 开发模式
npm run dev
# → http://localhost:3000

# 生产构建
npm run build

# 预览生产版本
npm run start
```

## 🎨 视觉系统

**深空数字文明主题**

| 颜色           | 值         | 用途   |
| ------------ | --------- | ---- |
| Space Deep   | `#030712` | 主背景  |
| Neon Blue    | `#4FC3F7` | 主强调色 |
| Neon Purple  | `#7C4DFF` | 次强调色 |
| Neon Cyan    | `#00E5FF` | 高亮色  |
| Plasma Amber | `#FFB300` | 警告色  |

**视觉风格**

- 玻璃拟态 (Glassmorphism)
- HUD 界面元素
- 动态粒子系统
- 神经网络连线
- 数字宇宙感

## 🏗️ 架构设计

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局 + SEO
│   └── page.tsx            # 主页面编排
├── components/
│   ├── core/               # 通用组件
│   │   ├── BootSequence.tsx
│   │   ├── Navigation.tsx
│   │   ├── AnimatedTitle.tsx
│   │   └── ...
│   ├── hero/               # Hero 区域
│   ├── agents/             # Agent 系统
│   ├── skills/             # 技能树
│   ├── city/               # 3D 城市
│   ├── dashboard/          # 指挥中心
│   ├── monitoring/         # 监控模块
│   ├── effects/            # 特效组件
│   └── ...
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具函数与数据
└── types/                  # TypeScript 类型定义
```

## 🌐 部署方案

### GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动运行 `npm run build`
3. 部署到 `gh-pages` 分支

### Vercel (推荐)

```bash
npm install -g vercel
vercel
```

### Cloudflare Pages

配置 `_worker.js` 或使用 Cloudflare Pages 直接部署 `out/` 目录。

## 📊 性能优化

| 优化项       | 策略                           |
| --------- | ---------------------------- |
| 首屏加载      | 代码分割 + 懒加载                   |
| Canvas 渲染 | DPR 上限 2x，隔帧渲染               |
| Three.js  | 几何体简化，光照优化                   |
| 动画        | GPU 加速，requestAnimationFrame |
| 静态导出      | 预渲染所有页面                      |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 📧 联系

- **Author**:尘一不染
- **Email**:3029956183\@qq.com
- **Website**: <https://nexus-ai-civilization.vercel.app>

***

**◈ NEXUS AI CIVILIZATION**

> "我们不是在构建网页，我们在构建未来 AI 文明的操作系统。"

***

*Built with Future Technology*
