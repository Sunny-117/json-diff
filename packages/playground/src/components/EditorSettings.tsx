import { useState, useEffect } from "react";
import "./EditorSettings.css";

export interface EditorPreferences {
  theme: "light" | "vs-dark";
  fontSize: number;
  minimap: boolean;
}

interface EditorSettingsProps {
  preferences: EditorPreferences;
  onPreferencesChange: (preferences: EditorPreferences) => void;
}

const STORAGE_KEY = "json-diff-editor-preferences";

/**
 * 从本地存储加载用户偏好设置
 */
export function loadPreferences(): EditorPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load preferences:", error);
  }

  // 默认偏好设置
  return {
    theme: "light",
    fontSize: 14,
    minimap: true,
  };
}

/**
 * 保存用户偏好设置到本地存储
 */
export function savePreferences(preferences: EditorPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

/**
 * 编辑器设置组件
 * 允许用户自定义编辑器外观和行为
 */
export function EditorSettings({ preferences, onPreferencesChange }: EditorSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const handleThemeChange = (theme: "light" | "vs-dark") => {
    onPreferencesChange({ ...preferences, theme });
  };

  const handleFontSizeChange = (fontSize: number) => {
    onPreferencesChange({ ...preferences, fontSize });
  };

  const handleMinimapToggle = () => {
    onPreferencesChange({ ...preferences, minimap: !preferences.minimap });
  };

  return (
    <div className="editor-settings">
      <button className="settings-toggle" onClick={() => setIsOpen(!isOpen)} title="编辑器设置">
        ⚙️ 设置
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>编辑器设置</h3>
            <button className="close-button" onClick={() => setIsOpen(false)} aria-label="关闭">
              ✕
            </button>
          </div>

          <div className="settings-content">
            <div className="setting-group">
              <label htmlFor="theme-select">主题</label>
              <select
                id="theme-select"
                value={preferences.theme}
                onChange={(e) => handleThemeChange(e.target.value as "light" | "vs-dark")}
                className="setting-select"
              >
                <option value="light">浅色</option>
                <option value="vs-dark">深色</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="font-size-input">字体大小: {preferences.fontSize}px</label>
              <input
                id="font-size-input"
                type="range"
                min="10"
                max="24"
                value={preferences.fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="setting-slider"
              />
            </div>

            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.minimap}
                  onChange={handleMinimapToggle}
                  className="setting-checkbox"
                />
                <span>显示小地图</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
