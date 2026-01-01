/**
 * 文件导入导出工具函数
 */

/**
 * 读取文件内容
 * @param file 文件对象
 * @returns Promise<string> 文件内容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * 导出文本内容为文件
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType MIME 类型
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  // 创建 Blob 对象
  const blob = new Blob([content], { type: mimeType });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 导出 JSON 对象为文件
 * @param data JSON 对象
 * @param filename 文件名
 */
export function downloadJSON(data: any, filename: string): void {
  const content = JSON.stringify(data, null, 2);
  downloadTextFile(content, filename, 'application/json');
}

/**
 * 触发文件选择对话框
 * @param accept 接受的文件类型
 * @returns Promise<File | null> 选择的文件
 */
export function selectFile(accept: string = '.json'): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0] || null;
      resolve(file);
    };
    
    input.oncancel = () => {
      resolve(null);
    };
    
    input.click();
  });
}
