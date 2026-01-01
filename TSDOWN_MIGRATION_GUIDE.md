# Tsdown 构建系统迁移指南

## 概述

本指南说明如何将项目从当前的 Vite + TSC 构建系统迁移到 tsdown。

## 什么是 Tsdown？

Tsdown 是一个现代化的 TypeScript 构建工具，提供：
- 更快的构建速度
- 简化的配置
- 原生支持 ESM 和 CJS 输出
- 内置类型声明生成

官方网站：https://tsdown.dev

## 迁移步骤

### 1. 安装 Tsdown

```bash
# 在根目录安装
pnpm add -D tsdown

# 或在各个包中安装
pnpm add -D tsdown --filter @json-visual-diff/core
pnpm add -D tsdown --filter @json-visual-diff/dom-renderer
pnpm add -D tsdown --filter @json-visual-diff/playground
```

### 2. 为 Core 包创建配置

创建 `packages/core/tsdown.config.ts`：

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,
});
```

### 3. 为 DOM Renderer 包创建配置

创建 `packages/dom-renderer/tsdown.config.ts`：

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,
  external: ['@json-visual-diff/core'],
});
```

### 4. 为 Playground 创建配置

Playground 是一个 Web 应用，可能仍需要使用 Vite 进行开发服务器和 HMR。
但可以使用 tsdown 进行生产构建：

创建 `packages/playground/tsdown.config.ts`：

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/main.tsx'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2020',
  minify: true,
  external: ['react', 'react-dom'],
  // 可能需要额外的插件来处理 JSX 和资源
});
```

**注意**：对于 Playground，建议保留 Vite 用于开发，仅在生产构建时考虑 tsdown。

### 5. 更新 Package.json 脚本

#### packages/core/package.json
```json
{
  "scripts": {
    "build": "tsdown",
    "build:watch": "tsdown --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

#### packages/dom-renderer/package.json
```json
{
  "scripts": {
    "build": "tsdown",
    "build:watch": "tsdown --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

#### packages/playground/package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsdown && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

### 6. 更新根 Package.json

```json
{
  "scripts": {
    "build": "pnpm -r --filter='!@json-visual-diff/playground' build && pnpm --filter @json-visual-diff/playground build",
    "build:watch": "pnpm -r --parallel build:watch"
  }
}
```

### 7. 验证构建输出

构建后检查以下内容：

1. **ESM 输出**：`dist/index.mjs` 或 `dist/index.js` (type: module)
2. **CJS 输出**：`dist/index.cjs` 或 `dist/index.js` (type: commonjs)
3. **类型声明**：`dist/index.d.ts`
4. **Source Maps**：`dist/*.map`

### 8. 更新 Package.json 导出字段

确保 package.json 正确配置导出：

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 9. 测试构建

```bash
# 清理旧的构建产物
pnpm -r exec rm -rf dist

# 执行新的构建
pnpm build

# 运行测试确保一切正常
pnpm test

# 检查类型
pnpm typecheck
```

### 10. 性能对比

记录迁移前后的构建时间：

```bash
# 迁移前
time pnpm build

# 迁移后
time pnpm build
```

## 潜在问题和解决方案

### 问题 1：Monorepo 依赖解析

如果包之间的依赖解析出现问题，确保：
- 使用 `external` 选项排除 workspace 依赖
- 构建顺序正确（先构建依赖包）

### 问题 2：React/JSX 支持

Tsdown 可能需要额外配置来处理 JSX：
```typescript
{
  jsx: 'react-jsx',
  jsxImportSource: 'react',
}
```

### 问题 3：资源文件处理

CSS、图片等资源文件可能需要额外的插件或保留 Vite 处理。

### 问题 4：开发体验

Tsdown 主要用于构建，不提供开发服务器。建议：
- 库包（core, dom-renderer）：使用 tsdown
- 应用（playground）：开发时使用 Vite，生产构建可选 tsdown

## 推荐的迁移策略

### 阶段 1：库包迁移（低风险）
1. 先迁移 `@json-visual-diff/core`
2. 测试并验证输出
3. 再迁移 `@json-visual-diff/dom-renderer`

### 阶段 2：应用迁移（可选）
1. 保留 Vite 用于开发
2. 评估是否需要迁移生产构建
3. 如果 Vite 性能足够，可以不迁移 Playground

## 回滚计划

如果迁移出现问题，可以快速回滚：

1. 恢复原有的 package.json 脚本
2. 删除 tsdown.config.ts 文件
3. 卸载 tsdown：`pnpm remove -D tsdown`
4. 重新构建：`pnpm build`

## 参考资源

- Tsdown 官方文档：https://tsdown.dev
- Tsdown GitHub：https://github.com/egoist/tsdown
- 配置示例：https://tsdown.dev/guide/configuration

## 结论

Tsdown 迁移可以提供更快的构建速度和更简单的配置，但需要仔细测试以确保：
- 所有输出格式正确
- 类型声明完整
- Monorepo 依赖正常工作
- 开发体验不受影响

建议采用渐进式迁移策略，先迁移库包，再考虑应用包。
