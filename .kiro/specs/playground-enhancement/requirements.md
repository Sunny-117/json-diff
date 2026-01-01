# 需求文档

## 简介

本文档规定了 JSON Visual Diff Playground 应用程序的增强需求。这些增强功能专注于改进用户界面布局、升级 JSON 编辑器组件以及现代化构建系统。

## 术语表

- **Playground（演示应用）**: JSON Visual Diff 的基于 Web 的演示应用程序
- **Monaco_Editor（Monaco 编辑器）**: 为 VS Code 提供支持的代码编辑器，用于 JSON 编辑
- **Layout（布局）**: 屏幕上 UI 组件的排列方式
- **Tsdown（构建工具）**: 现代化的 TypeScript 构建工具 (tsdown.dev)
- **Old_JSON（旧 JSON）**: 用于比较的原始/左侧 JSON 输入
- **New_JSON（新 JSON）**: 用于比较的修改后/右侧 JSON 输入
- **Diff_Result（差异结果）**: 两个 JSON 对象之间差异的可视化表示
- **Build_System（构建系统）**: 用于编译和打包项目的工具链

## 需求

### 需求 1：JSON 输入的垂直布局

**用户故事：** 作为用户，我希望新旧 JSON 编辑器垂直排列（上下布局），以便我可以更舒适地查看较长的 JSON 文档，并为差异结果提供更多的水平空间。

#### 验收标准

1. WHEN Playground 加载时，THE Playground SHALL 在左侧区域的顶部显示 Old_JSON 编辑器
2. WHEN Playground 加载时，THE Playground SHALL 在左侧区域的底部显示 New_JSON 编辑器
3. WHEN Playground 加载时，THE Playground SHALL 在右侧区域显示 Diff_Result
4. THE Playground SHALL 为 JSON 编辑器区域分配大约 50% 的视口宽度
5. THE Playground SHALL 为 Diff_Result 区域分配大约 50% 的视口宽度

### 需求 2：Monaco Editor 集成

**用户故事：** 作为用户，我希望使用 Monaco Editor 进行 JSON 编辑，以便我可以享受语法高亮、自动补全、错误检测和其他高级编辑功能。

#### 验收标准

1. WHEN 用户在 JSON 编辑器中输入时，THE Monaco_Editor SHALL 为 JSON 提供语法高亮
2. WHEN 用户输入无效的 JSON 时，THE Monaco_Editor SHALL 显示内联错误指示器
3. WHEN 用户在 JSON 编辑器中输入时，THE Monaco_Editor SHALL 提供自动补全建议
4. WHEN 用户按下 Ctrl+Space（或 Mac 上的 Cmd+Space）时，THE Monaco_Editor SHALL 显示可用的补全选项
5. THE Monaco_Editor SHALL 支持括号匹配和自动闭合
6. THE Monaco_Editor SHALL 支持嵌套 JSON 结构的代码折叠
7. WHEN 用户粘贴 JSON 内容时，THE Monaco_Editor SHALL 自动格式化它
8. THE Monaco_Editor SHALL 使用适合代码编辑的等宽字体
9. THE Monaco_Editor SHALL 支持撤销/重做操作
10. THE Monaco_Editor SHALL 可通过键盘导航访问

### 需求 3：Tsdown 构建系统

**用户故事：** 作为开发者，我希望使用 tsdown 构建项目，以便我可以享受更快的构建时间和现代化的构建工具。

#### 验收标准

1. WHEN 运行构建命令时，THE Build_System SHALL 使用 tsdown 编译 TypeScript 文件
2. WHEN 构建包时，THE Build_System SHALL 生成 ESM 和 CommonJS 两种输出格式
3. WHEN 构建包时，THE Build_System SHALL 生成 TypeScript 声明文件
4. WHEN 构建 Playground 时，THE Build_System SHALL 为生产环境打包应用程序
5. THE Build_System SHALL 保留 source maps 以便调试
6. WHEN 依赖项更改时，THE Build_System SHALL 仅重新构建受影响的包
7. THE Build_System SHALL 支持开发模式的监视模式
8. WHEN 构建时，THE Build_System SHALL 验证 TypeScript 类型
9. THE Build_System SHALL 比当前的 Vite + TSC 设置更快地完成构建
10. THE Build_System SHALL 保持与现有包结构的兼容性

### 需求 4：响应式布局

**用户故事：** 作为用户，我希望 Playground 在不同屏幕尺寸下都能良好工作，以便我可以在各种设备上使用它。

#### 验收标准

1. WHEN 视口宽度小于 768px 时，THE Playground SHALL 将所有部分垂直堆叠
2. WHEN 视口宽度大于 768px 时，THE Playground SHALL 显示两列布局
3. WHEN 调整窗口大小时，THE Playground SHALL 平滑地调整布局
4. THE Playground SHALL 在视口宽度低至 320px 时保持可用性
5. WHEN 在移动设备上时，THE Playground SHALL 提供触摸友好的控件

### 需求 5：编辑器配置

**用户故事：** 作为用户，我希望配置编辑器偏好设置，以便我可以根据需要自定义编辑体验。

#### 验收标准

1. WHERE 主题选择可用时，THE Playground SHALL 允许用户在 Monaco_Editor 的浅色和深色主题之间选择
2. WHERE 字体大小控制可用时，THE Playground SHALL 允许用户调整编辑器字体大小
3. WHERE 小地图切换可用时，THE Playground SHALL 允许用户显示/隐藏小地图
4. WHEN 用户偏好设置更改时，THE Playground SHALL 将它们持久化到本地存储
5. WHEN Playground 加载时，THE Playground SHALL 从本地存储恢复用户偏好设置

### 需求 6：构建配置迁移

**用户故事：** 作为开发者，我希望从当前构建系统迁移到 tsdown，以便项目一致地使用现代化工具。

#### 验收标准

1. THE Build_System SHALL 用 tsdown 替换 Vite 来构建 Playground
2. THE Build_System SHALL 用 tsdown 替换 TSC 来构建包
3. WHEN 迁移时，THE Build_System SHALL 保持所有现有的构建输出
4. WHEN 迁移时，THE Build_System SHALL 保持所有现有的 npm 脚本
5. THE Build_System SHALL 在构建失败时提供清晰的错误消息
6. THE Build_System SHALL 支持现有的 pnpm workspaces monorepo 结构
7. WHEN 构建时，THE Build_System SHALL 遵守现有的 tsconfig.json 设置
8. THE Build_System SHALL 支持独立构建单个包

### 需求 7：性能优化

**用户故事：** 作为用户，我希望 Playground 快速加载和响应，以便我可以高效地处理大型 JSON 文件。

#### 验收标准

1. WHEN 加载 Playground 时，THE Playground SHALL 在 2 秒内初始化 Monaco_Editor
2. WHEN 比较 JSON 文件时，THE Playground SHALL 在 1 秒内显示最大 100KB 文件的结果
3. WHEN 在编辑器中输入时，THE Playground SHALL 提供即时反馈而不卡顿
4. THE Playground SHALL 延迟加载 Monaco_Editor 资源以减少初始包大小
5. WHEN 渲染差异结果时，THE Playground SHALL 对大型结果集使用虚拟化

### 需求 8：向后兼容性

**用户故事：** 作为开发者，我希望增强的 Playground 保持与现有功能的兼容性，以便在升级过程中不会丢失任何功能。

#### 验收标准

1. WHEN Playground 被增强时，THE Playground SHALL 保持所有现有的示例场景
2. WHEN Playground 被增强时，THE Playground SHALL 保持 JSON 导入/导出功能
3. WHEN Playground 被增强时，THE Playground SHALL 保持 HTML 导出功能
4. WHEN Playground 被增强时，THE Playground SHALL 保持现有的 diff 算法
5. WHEN Playground 被增强时，THE Playground SHALL 保持现有的 DOM 渲染器集成
6. THE Playground SHALL 继续支持所有之前支持的浏览器
