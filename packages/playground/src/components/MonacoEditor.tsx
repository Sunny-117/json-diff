import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title: string;
  theme?: 'light' | 'vs-dark';
  fontSize?: number;
  minimap?: boolean;
}

/**
 * Monaco Editor 组件
 * 提供高级 JSON 编辑功能，包括语法高亮、自动补全、错误检测等
 */
export function MonacoEditor({
  value,
  onChange,
  title,
  theme = 'light',
  fontSize = 14,
  minimap = true,
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // 设置编辑器焦点
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // 当主题或字体大小改变时更新编辑器
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        minimap: { enabled: minimap },
      });
    }
  }, [fontSize, minimap]);

  return (
    <div className="monaco-editor-container">
      <div className="editor-header">
        <h3>{title}</h3>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={theme === 'light' ? 'vs' : 'vs-dark'}
          options={{
            fontSize,
            minimap: { enabled: minimap },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            bracketPairColorization: {
              enabled: true,
            },
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'inline',
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            glyphMargin: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}
