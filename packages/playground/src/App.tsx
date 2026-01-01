import { useState, useRef, useEffect } from 'react';
import { JSONEditor } from './components/JSONEditor';
import { validateJSON } from './utils/jsonValidator';
import { diff } from '@json-visual-diff/core';
import { DOMRenderer } from '@json-visual-diff/dom-renderer';
import type { DiffResult } from '@json-visual-diff/core';
import { examples, getExampleById } from './examples';
import { selectFile, readFileAsText, downloadJSON, downloadTextFile } from './utils/fileUtils';
import './App.css';

function App() {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedExample, setSelectedExample] = useState<string>('');
  const resultContainerRef = useRef<HTMLDivElement>(null);

  // 当 diffResult 改变时，使用 DOM 渲染器渲染结果
  useEffect(() => {
    if (diffResult && resultContainerRef.current) {
      // 清空容器
      resultContainerRef.current.innerHTML = '';
      
      // 创建渲染器并渲染
      const renderer = new DOMRenderer({
        theme: 'light',
        expandDepth: 3,
        showUnchanged: true,
      });
      
      const renderedElement = renderer.render(diffResult);
      resultContainerRef.current.appendChild(renderedElement);
    }
  }, [diffResult]);

  // 处理示例选择
  const handleExampleChange = (exampleId: string) => {
    setSelectedExample(exampleId);
    
    if (!exampleId) {
      // 清空选择
      return;
    }
    
    const example = getExampleById(exampleId);
    if (example) {
      setLeftJson(example.left);
      setRightJson(example.right);
      // 清空之前的结果
      setDiffResult(null);
      setError('');
    }
  };

  // 导入 JSON 文件到左侧编辑器
  const handleImportLeft = async () => {
    try {
      const file = await selectFile('.json');
      if (file) {
        const content = await readFileAsText(file);
        setLeftJson(content);
        setSelectedExample(''); // 清空示例选择
      }
    } catch (err) {
      setError(`导入失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // 导入 JSON 文件到右侧编辑器
  const handleImportRight = async () => {
    try {
      const file = await selectFile('.json');
      if (file) {
        const content = await readFileAsText(file);
        setRightJson(content);
        setSelectedExample(''); // 清空示例选择
      }
    } catch (err) {
      setError(`导入失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // 导出 diff 结果为 JSON
  const handleExportDiff = () => {
    if (!diffResult) {
      setError('没有可导出的 diff 结果');
      return;
    }
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadJSON(diffResult, `diff-result-${timestamp}.json`);
    } catch (err) {
      setError(`导出失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // 导出 diff 结果为 HTML
  const handleExportHTML = () => {
    if (!diffResult || !resultContainerRef.current) {
      setError('没有可导出的 diff 结果');
      return;
    }
    
    try {
      // 获取渲染的 HTML
      const htmlContent = resultContainerRef.current.innerHTML;
      
      // 创建完整的 HTML 文档
      const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JSON Diff Result</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      padding: 2rem;
      background-color: #f5f5f5;
    }
    .json-diff-container {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.6;
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .json-diff-stats {
      display: flex;
      gap: 1rem;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .diff-line {
      display: flex;
      align-items: center;
      padding: 2px 0;
      min-height: 24px;
    }
    .toggle-button {
      margin-right: 4px;
      font-size: 12px;
      width: 16px;
      height: 16px;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .key {
      font-weight: 600;
      margin-right: 4px;
    }
    .old-value {
      text-decoration: line-through;
      opacity: 0.7;
    }
    .arrow {
      margin: 0 8px;
      font-weight: bold;
    }
    .new-value {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>JSON Diff Result</h1>
  ${htmlContent}
</body>
</html>`;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadTextFile(fullHTML, `diff-result-${timestamp}.html`, 'text/html');
    } catch (err) {
      setError(`导出失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCompare = () => {
    // 清空之前的错误和结果
    setError('');
    setDiffResult(null);

    // 验证两个 JSON 输入
    const leftValidation = validateJSON(leftJson);
    const rightValidation = validateJSON(rightJson);

    if (!leftValidation.isValid) {
      setError(`原始 JSON 错误: ${leftValidation.error}`);
      return;
    }

    if (!rightValidation.isValid) {
      setError(`新 JSON 错误: ${rightValidation.error}`);
      return;
    }

    if (!leftJson.trim() || !rightJson.trim()) {
      setError('请输入要比较的 JSON 数据');
      return;
    }

    try {
      // 解析 JSON
      const leftValue = JSON.parse(leftJson);
      const rightValue = JSON.parse(rightJson);

      // 计算 diff
      const result = diff(leftValue, rightValue);
      setDiffResult(result);
    } catch (err) {
      setError(`比较失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>JSON Visual Diff Playground</h1>
        <p>比较两个 JSON 对象的差异</p>
      </header>

      <div className="toolbar">
        <div className="example-selector">
          <label htmlFor="example-select">选择示例:</label>
          <select
            id="example-select"
            value={selectedExample}
            onChange={(e) => handleExampleChange(e.target.value)}
            className="example-select"
          >
            <option value="">-- 选择一个示例 --</option>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.name}
              </option>
            ))}
          </select>
          {selectedExample && (
            <span className="example-description">
              {getExampleById(selectedExample)?.description}
            </span>
          )}
        </div>
        
        <div className="file-actions">
          <button className="action-button" onClick={handleImportLeft} title="导入 JSON 文件到左侧">
            📁 导入左侧
          </button>
          <button className="action-button" onClick={handleImportRight} title="导入 JSON 文件到右侧">
            📁 导入右侧
          </button>
          <button 
            className="action-button" 
            onClick={handleExportDiff} 
            disabled={!diffResult}
            title="导出 diff 结果为 JSON"
          >
            💾 导出 JSON
          </button>
          <button 
            className="action-button" 
            onClick={handleExportHTML} 
            disabled={!diffResult}
            title="导出 diff 结果为 HTML"
          >
            💾 导出 HTML
          </button>
        </div>
      </div>

      <div className="editor-container">
        <JSONEditor
          value={leftJson}
          onChange={setLeftJson}
          placeholder="在此输入原始 JSON..."
          title="原始 JSON"
        />

        <div className="compare-section">
          <button className="compare-button" onClick={handleCompare}>
            比较 →
          </button>
        </div>

        <JSONEditor
          value={rightJson}
          onChange={setRightJson}
          placeholder="在此输入新 JSON..."
          title="新 JSON"
        />
      </div>

      <div className="result-container">
        <div className="result-header">
          <h2>差异结果</h2>
          {diffResult && (
            <div className="result-stats">
              <span className="stat-label">统计:</span>
              <span className="stat-item added">+{diffResult.stats.added}</span>
              <span className="stat-item deleted">-{diffResult.stats.deleted}</span>
              <span className="stat-item modified">~{diffResult.stats.modified}</span>
              <span className="stat-item unchanged">={diffResult.stats.unchanged}</span>
            </div>
          )}
        </div>
        <div className="result-content" ref={resultContainerRef}>
          {error && <div className="error-message">{error}</div>}
          {!error && !diffResult && <div className="placeholder">点击"比较"按钮查看差异</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
