
import React, { useRef, useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { TerminalSettings, THEMES } from '../types';

interface TerminalPreviewProps {
  settings: TerminalSettings;
  content: string;
  onWidthResize?: (newWidth: number) => void;
}

const TerminalPreview: React.FC<TerminalPreviewProps> = ({ settings, content, onWidthResize }) => {
  const theme = THEMES[settings.theme];
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const [copied, setCopied] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !onWidthResize) return;
    const container = resizeRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newWidth = Math.max(300, Math.min(1000, e.clientX - rect.left));
    onWidthResize(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderWindowButtons = () => {
    if (settings.windowStyle === 'macos') {
      return (
        <div className="flex gap-2 mr-4">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-sm"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-sm"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-sm"></div>
        </div>
      );
    }
    if (settings.windowStyle === 'windows') {
      return (
        <div className="flex gap-3 ml-auto text-slate-400 text-[10px] items-center">
          <div className="w-3 h-[1px] bg-current"></div>
          <div className="w-3 h-3 border border-current"></div>
          <div className="w-3 h-3 flex items-center justify-center">
            <div className="w-3 h-3 rotate-45 relative">
              <div className="absolute top-1.5 left-0 w-full h-[1px] bg-current"></div>
              <div className="absolute top-0 left-1.5 w-[1px] h-full bg-current"></div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      ref={resizeRef}
      className="inline-block transition-all duration-300 relative group"
      style={{ 
        padding: `${settings.padding}px`,
      }}
    >
      <div 
        className={`rounded-xl overflow-hidden min-w-[300px] flex flex-col relative ${settings.shadow ? 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]' : ''}`}
        style={{ 
          backgroundColor: theme.background,
          border: `1px solid ${theme.border}`,
          opacity: settings.opacity / 100,
          width: `${settings.width}px`
        }}
      >
        {/* Header Bar */}
        {(settings.windowStyle !== 'none' || settings.showTitle) && (
          <div 
            className="flex items-center px-4 py-2.5 border-b"
            style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.border,
                filter: 'brightness(1.1)' 
            }}
          >
            {settings.windowStyle === 'macos' && renderWindowButtons()}
            
            {settings.showTitle && (
              <div 
                className={`text-[11px] font-medium mx-auto flex-1 text-center truncate px-2`}
                style={{ color: theme.text, opacity: 0.5 }}
              >
                {settings.title}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                title="Copy text to clipboard"
                className="p-1.5 rounded-md transition-all hover:bg-white/10 flex items-center justify-center"
                style={{ color: theme.text, opacity: copied ? 1 : 0.4 }}
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              {settings.windowStyle === 'windows' && renderWindowButtons()}
            </div>
          </div>
        )}

        {/* Content Area - Floating copy button if no header */}
        <div className="relative">
          {settings.windowStyle === 'none' && !settings.showTitle && (
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10"
              style={{ color: theme.text }}
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          )}
          
          <div 
            className="p-6 mono overflow-hidden whitespace-pre-wrap break-all"
            style={{ 
              color: theme.text,
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineSpacing,
            }}
          >
            {content.split('\n').map((line, i) => {
              const isCommand = line.trim().startsWith('$') || line.trim().startsWith('>');
              return (
                <div key={i} className="flex">
                  <span className={isCommand ? '' : 'opacity-80'}>
                    {line}
                    {i === content.split('\n').length - 1 && (
                      <span 
                        className="inline-block w-2 h-[1.2em] ml-1 animate-pulse align-middle" 
                        style={{ backgroundColor: theme.cursor }}
                      ></span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 cursor-ew-resize flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity"
        title="Drag to resize"
      >
        <div className="w-1.5 h-full rounded-full bg-blue-500/50 hover:bg-blue-500 transition-colors"></div>
      </div>
    </div>
  );
};

export default TerminalPreview;
