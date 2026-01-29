
import React from 'react';
import { Terminal as TerminalIcon, Palette, Layout, Type, Layers } from 'lucide-react';
import { TerminalSettings, THEMES, WindowStyle } from '../types';

interface SidebarProps {
  settings: TerminalSettings;
  setSettings: React.Dispatch<React.SetStateAction<TerminalSettings>>;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings }) => {
  const updateSetting = <K extends keyof TerminalSettings>(key: K, value: TerminalSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-full lg:w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="p-6 border-b border-slate-800 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <TerminalIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">TermiSnap</h1>
            <p className="text-xs text-slate-500 font-medium">CLI Visualization Tool</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Appearance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Theme</h2>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(THEMES).map(([id, theme]) => (
              <button
                key={id}
                onClick={() => updateSetting('theme', id)}
                title={theme.name}
                className={`w-full aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                  settings.theme === id ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full flex flex-col">
                   <div className="flex-1" style={{ backgroundColor: theme.background }}></div>
                   <div className="h-2" style={{ backgroundColor: theme.accent }}></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Window Controls */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-green-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Window</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {(['macos', 'windows', 'none'] as WindowStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => updateSetting('windowStyle', style)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  settings.windowStyle === style 
                    ? 'bg-slate-700 border-slate-500 text-white' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="text-sm text-slate-400">Show Title</label>
            <input 
              type="checkbox" 
              checked={settings.showTitle}
              onChange={(e) => updateSetting('showTitle', e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500"
            />
          </div>

          {settings.showTitle && (
            <input 
              type="text" 
              value={settings.title}
              onChange={(e) => updateSetting('title', e.target.value)}
              className="w-full bg-slate-800 rounded-lg p-2 text-sm text-slate-300 border border-slate-700"
              placeholder="Window Title"
            />
          )}
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Type size={18} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Typography</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500">Font Size</label>
                <span className="text-xs text-blue-400">{settings.fontSize}px</span>
              </div>
              <input 
                type="range" min="10" max="24" step="1"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500">Line Height</label>
                <span className="text-xs text-blue-400">{settings.lineSpacing}</span>
              </div>
              <input 
                type="range" min="1" max="2.5" step="0.1"
                value={settings.lineSpacing}
                onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Layout */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-pink-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Canvas</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500">Width</label>
                <span className="text-xs text-blue-400">{settings.width}px</span>
              </div>
              <input 
                type="range" min="300" max="1000" step="10"
                value={settings.width}
                onChange={(e) => updateSetting('width', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-slate-500">Padding</label>
                <span className="text-xs text-blue-400">{settings.padding}px</span>
              </div>
              <input 
                type="range" min="0" max="100" step="4"
                value={settings.padding}
                onChange={(e) => updateSetting('padding', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Drop Shadow</label>
              <input 
                type="checkbox" 
                checked={settings.shadow}
                onChange={(e) => updateSetting('shadow', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500"
              />
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
