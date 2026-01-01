/**
 * JSON 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

/**
 * 验证 JSON 字符串
 * @param jsonString - 要验证的 JSON 字符串
 * @returns 验证结果
 */
export function validateJSON(jsonString: string): ValidationResult {
  // 空字符串视为有效（未输入状态）
  if (!jsonString.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // 尝试从错误消息中提取位置信息
      const positionMatch = error.message.match(/position (\d+)/);
      const lineMatch = error.message.match(/line (\d+)/);
      const columnMatch = error.message.match(/column (\d+)/);

      let errorLine: number | undefined;
      let errorColumn: number | undefined;

      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        const lines = jsonString.substring(0, position).split("\n");
        errorLine = lines.length;
        errorColumn = lines[lines.length - 1].length + 1;
      } else {
        if (lineMatch) errorLine = parseInt(lineMatch[1], 10);
        if (columnMatch) errorColumn = parseInt(columnMatch[1], 10);
      }

      return {
        isValid: false,
        error: error.message,
        errorLine,
        errorColumn,
      };
    }

    return {
      isValid: false,
      error: "未知的 JSON 解析错误",
    };
  }
}

/**
 * 格式化 JSON 字符串
 * @param jsonString - 要格式化的 JSON 字符串
 * @param indent - 缩进空格数
 * @returns 格式化后的 JSON 字符串，如果解析失败则返回原字符串
 */
export function formatJSON(jsonString: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch {
    return jsonString;
  }
}
