import { useState, useEffect } from "react";
import { validateJSON, type ValidationResult } from "../utils/jsonValidator";
import "./JSONEditor.css";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title: string;
}

/**
 * JSON 编辑器组件
 * 提供实时语法验证和错误提示
 */
export function JSONEditor({ value, onChange, placeholder, title }: JSONEditorProps) {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  // 实时验证 JSON
  useEffect(() => {
    const result = validateJSON(value);
    setValidation(result);
  }, [value]);

  return (
    <div className="json-editor-container">
      <div className={`editor-header ${!validation.isValid ? "error" : ""}`}>
        <h2>{title}</h2>
        {!validation.isValid && <span className="error-badge">语法错误</span>}
      </div>

      <textarea
        className={`json-textarea ${!validation.isValid ? "error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />

      {!validation.isValid && validation.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <div className="error-details">
            <div className="error-text">{validation.error}</div>
            {validation.errorLine && (
              <div className="error-location">
                行 {validation.errorLine}
                {validation.errorColumn && `, 列 ${validation.errorColumn}`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
