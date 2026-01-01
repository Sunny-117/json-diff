# JSON Visual Diff SDK

通用的 JSON 可视化 diff SDK，支持可插拔的渲染器架构。

## ✨ 最新更新

### Playground 增强功能

JSON Visual Diff Playground 已经全面升级！主要新特性：

- 🎨 **Monaco Editor 集成**：VS Code 同款编辑器，支持语法高亮、自动补全、错误检测等
- 📐 **全新垂直布局**：左侧垂直排列两个编辑器，右侧显示差异结果
- ⚙️ **编辑器设置**：自定义主题（浅色/深色）、字体大小、小地图等
- 📱 **完全响应式**：完美适配桌面、平板和手机
- 💾 **设置持久化**：用户偏好自动保存到本地存储

查看 [Playground 功能指南](packages/playground/FEATURES.md) 了解详情。

## 项目结构

```
json-visual-diff/
├── packages/
│   ├── core/                 # 核心 diff 算法库
│   ├── dom-renderer/         # DOM 渲染器
│   └── playground/           # 演示应用（已升级）
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── package.json              # 根 package.json
├── tsconfig.json             # TypeScript 配置
└── vitest.config.ts          # Vitest 测试配置
```

## 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 安装依赖

```bash
pnpm install
```

## 可用脚本

- `pnpm build` - 构建所有包
- `pnpm test` - 运行所有测试
- `pnpm test:watch` - 监听模式运行测试
- `pnpm lint` - 代码检查
- `pnpm format` - 格式化代码
- `pnpm typecheck` - 类型检查

## 包说明

### @json-visual-diff/core

核心 diff 算法库，提供 JSON 对象比较功能。

### @json-visual-diff/dom-renderer

DOM 渲染器，将 diff 结果渲染为浏览器 DOM 元素。

### @json-visual-diff/playground

演示应用，提供交互式界面测试 diff 功能。

**快速启动 Playground：**

```bash
cd packages/playground
pnpm dev
```

访问 http://localhost:3000 体验全新的 Playground！

## 文档

- [实现总结](IMPLEMENTATION_SUMMARY.md) - 查看已完成的功能和技术细节
- [Playground 功能指南](packages/playground/FEATURES.md) - 了解 Playground 的所有新功能
- [Tsdown 迁移指南](TSDOWN_MIGRATION_GUIDE.md) - 构建系统迁移计划

## License

MIT
