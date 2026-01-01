# JSON Visual Diff SDK

通用的 JSON 可视化 diff SDK，支持可插拔的渲染器架构。

## 项目结构

```
json-visual-diff/
├── packages/
│   ├── core/                 # 核心 diff 算法库
│   ├── dom-renderer/         # DOM 渲染器
│   └── playground/           # 演示应用
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

## License

MIT
