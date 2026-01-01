/**
 * 预设示例数据
 * 提供多个示例供用户快速测试
 */

export interface Example {
  id: string;
  name: string;
  description: string;
  left: string;
  right: string;
}

export const examples: Example[] = [
  {
    id: "basic",
    name: "基础对象比较",
    description: "简单的对象属性增删改",
    left: JSON.stringify(
      {
        name: "John",
        age: 25,
        city: "New York",
      },
      null,
      2,
    ),
    right: JSON.stringify(
      {
        name: "John",
        age: 26,
        city: "San Francisco",
        email: "john@example.com",
      },
      null,
      2,
    ),
  },
  {
    id: "nested",
    name: "嵌套对象",
    description: "包含嵌套结构的对象比较",
    left: JSON.stringify(
      {
        user: {
          name: "Alice",
          profile: {
            age: 30,
            location: "Beijing",
          },
        },
        settings: {
          theme: "dark",
          notifications: true,
        },
      },
      null,
      2,
    ),
    right: JSON.stringify(
      {
        user: {
          name: "Alice",
          profile: {
            age: 31,
            location: "Shanghai",
            bio: "Software Engineer",
          },
        },
        settings: {
          theme: "light",
          notifications: true,
          language: "zh-CN",
        },
      },
      null,
      2,
    ),
  },
  {
    id: "array",
    name: "数组比较",
    description: "数组元素的增删改",
    left: JSON.stringify(
      {
        tags: ["javascript", "typescript", "react"],
        scores: [85, 90, 78],
      },
      null,
      2,
    ),
    right: JSON.stringify(
      {
        tags: ["typescript", "react", "vue", "node"],
        scores: [85, 92, 78, 88],
      },
      null,
      2,
    ),
  },
  {
    id: "complex",
    name: "复杂数据结构",
    description: "包含多层嵌套和数组的复杂结构",
    left: JSON.stringify(
      {
        project: {
          name: "JSON Diff SDK",
          version: "1.0.0",
          dependencies: [
            { name: "react", version: "18.0.0" },
            { name: "typescript", version: "5.0.0" },
          ],
          config: {
            build: {
              target: "es2020",
              minify: true,
            },
          },
        },
      },
      null,
      2,
    ),
    right: JSON.stringify(
      {
        project: {
          name: "JSON Diff SDK",
          version: "1.1.0",
          dependencies: [
            { name: "react", version: "18.2.0" },
            { name: "typescript", version: "5.0.0" },
            { name: "vite", version: "4.0.0" },
          ],
          config: {
            build: {
              target: "es2022",
              minify: true,
              sourcemap: true,
            },
            test: {
              coverage: true,
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: "api-response",
    name: "API 响应对比",
    description: "模拟 API 响应数据的变化",
    left: JSON.stringify(
      {
        status: "success",
        data: {
          users: [
            { id: 1, name: "Alice", active: true },
            { id: 2, name: "Bob", active: false },
          ],
          total: 2,
          page: 1,
        },
        timestamp: "2024-01-01T00:00:00Z",
      },
      null,
      2,
    ),
    right: JSON.stringify(
      {
        status: "success",
        data: {
          users: [
            { id: 1, name: "Alice", active: true, role: "admin" },
            { id: 2, name: "Bob", active: true },
            { id: 3, name: "Charlie", active: true },
          ],
          total: 3,
          page: 1,
        },
        timestamp: "2024-01-02T00:00:00Z",
      },
      null,
      2,
    ),
  },
  {
    id: "empty",
    name: "空对象",
    description: "从空对象到有内容的对象",
    left: JSON.stringify({}, null, 2),
    right: JSON.stringify(
      {
        message: "Hello, World!",
        count: 42,
        items: ["a", "b", "c"],
      },
      null,
      2,
    ),
  },
];

/**
 * 根据 ID 获取示例
 */
export function getExampleById(id: string): Example | undefined {
  return examples.find((example) => example.id === id);
}
