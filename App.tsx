
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Download, Settings, Github, Copy, Check, FileCode, FileType } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { THEMES, TerminalSettings, WindowStyle } from './types';
import Sidebar from './components/Sidebar';
import TerminalPreview from './components/TerminalPreview';

const SETTINGS_STORAGE_KEY = 'termisnap_settings';
const CONTENT_STORAGE_KEY = 'termisnap_content';

const DEFAULT_SETTINGS: TerminalSettings = {
  theme: 'dracula',
  windowStyle: 'macos',
  fontSize: 14,
  padding: 32,
  showTitle: true,
  title: 'bash — 80×24',
  lineSpacing: 1.5,
  opacity: 100,
  shadow: true,
  width: 600,
};

const DEFAULT_CONTENT = "$ git commit -m \"Initial commit\"\n[main (root-commit) 52b8f1a] Initial commit\n 1 file changed, 1 insertion(+)\n create mode 100644 index.js\n$ npm start\n> project@1.0.0 start\n> node index.js\n\nServer running at http://localhost:3000/";

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [content, setContent] = useState<string>(() => {
    const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
    return saved !== null ? saved : DEFAULT_CONTENT;
  });

  const [settings, setSettings] = useState<TerminalSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
    return DEFAULT_SETTINGS;
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(CONTENT_STORAGE_KEY, content);
  }, [content]);

  const waitForFonts = async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  };

  const handleDownload = async () => {
    if (!terminalRef.current) return;
    setIsDownloading(true);
    try {
      await waitForFonts();
      const dataUrl = await htmlToImage.toPng(terminalRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'transparent',
      });
      const link = document.createElement('a');
      link.download = `terminal-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to generate image.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHtml = () => {
    setIsDownloadingHtml(true);
    const theme = THEMES[settings.theme];
    
    const htmlOutput = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${settings.title || 'Terminal Export'}</title>
  <style>
    body { background: transparent; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .canvas { padding: ${settings.padding}px; }
    .terminal { 
      background: ${theme.background}; 
      color: ${theme.text}; 
      border-radius: 12px; 
      overflow: hidden; 
      width: ${settings.width}px; 
      max-width: 100vw;
      border: 1px solid ${theme.border};
      ${settings.shadow ? 'box-shadow: 0 35px 60px -15px rgba(0,0,0,0.6);' : ''}
      font-family: 'Fira Code', 'Courier New', Courier, monospace;
      font-size: ${settings.fontSize}px;
      line-height: ${settings.lineSpacing};
      position: relative;
    }
    .header { 
      padding: 10px 16px; 
      border-bottom: 1px solid ${theme.border}; 
      display: flex; 
      align-items: center; 
      background: ${theme.background};
      filter: brightness(1.1);
    }
    .dots { display: flex; gap: 8px; margin-right: 16px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .title { flex: 1; text-align: center; font-size: 11px; opacity: 0.5; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .content { padding: 24px; white-space: pre-wrap; word-break: break-all; }
    
    .copy-btn {
      background: transparent;
      border: none;
      color: ${theme.text};
      opacity: 0.4;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .copy-btn:hover { background: rgba(255, 255, 255, 0.1); opacity: 1; }
    .copy-btn.success { opacity: 1; color: #4ade80; }
    .icon-copy, .icon-check { width: 14px; height: 14px; }
    .icon-check { display: none; }
    .copy-btn.success .icon-copy { display: none; }
    .copy-btn.success .icon-check { display: block; }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
</head>
<body>
  <div class="canvas">
    <div class="terminal">
      ${(settings.windowStyle !== 'none' || settings.showTitle) ? `
      <div class="header">
        ${settings.windowStyle === 'macos' ? `
          <div class="dots">
            <div class="dot dot-red"></div>
            <div class="dot dot-yellow"></div>
            <div class="dot dot-green"></div>
          </div>
        ` : ''}
        ${settings.showTitle ? `<div class="title">${settings.title}</div>` : ''}
        <button id="copyButton" class="copy-btn" title="Copy text">
          <svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <svg class="icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>` : `
        <button id="copyButton" class="copy-btn" style="position: absolute; top: 12px; right: 12px; z-index: 10;" title="Copy text">
          <svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <svg class="icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      `}
      <div class="content" id="terminalContent">${content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
  </div>

  <script>
    const copyBtn = document.getElementById('copyButton');
    const content = document.getElementById('terminalContent').innerText;
    
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(content);
        copyBtn.classList.add('success');
        setTimeout(() => {
          copyBtn.classList.remove('success');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlOutput.trim()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terminal-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setIsDownloadingHtml(false);
  };

  const handleCopy = async () => {
    if (!terminalRef.current) return;
    try {
      await waitForFonts();
      const dataUrl = await htmlToImage.toBlob(terminalRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      if (dataUrl) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': dataUrl })
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="lg:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="text-blue-400" />
          <h1 className="font-bold text-lg tracking-tight">TermiSnap</h1>
        </div>
        <button onClick={handleDownload} className="bg-blue-600 p-2 rounded-lg">
          <Download size={20} />
        </button>
      </div>

      <Sidebar 
        settings={settings} 
        setSettings={setSettings} 
      />

      <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center space-y-8 relative z-10">
          <div className="w-full flex justify-between items-center mb-4">
             <div className="hidden lg:flex items-center gap-3">
               <div className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Ready to Snap
               </div>
             </div>
             
             <div className="flex items-center gap-2 w-full lg:w-auto">
               <button 
                onClick={handleCopy}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2.5 rounded-xl border border-slate-700 font-medium text-sm"
               >
                 {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                 <span>{copySuccess ? 'Copied!' : 'Copy PNG'}</span>
               </button>

               <div className="flex gap-2">
                 <button 
                  onClick={handleDownloadHtml}
                  disabled={isDownloadingHtml}
                  title="Download interactive HTML"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-all px-4 py-2.5 rounded-xl border border-slate-700 font-medium text-sm text-blue-400"
                 >
                   <FileCode size={16} />
                   <span>HTML</span>
                 </button>
                 
                 <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  title="Download as high-quality PNG"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 font-bold text-sm"
                 >
                   {isDownloading ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                   ) : (
                     <FileType size={16} />
                   )}
                   <span>PNG</span>
                 </button>
               </div>
             </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
            <div className="flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Terminal Input</span>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setContent('')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400 uppercase font-bold"
                   >
                     Clear
                   </button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
                className="flex-1 p-6 bg-transparent outline-none resize-none mono text-blue-100 text-sm leading-relaxed"
                placeholder="Type your terminal commands here..."
              />
            </div>

            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div ref={terminalRef} className="max-w-full overflow-visible">
                <TerminalPreview 
                  settings={settings} 
                  content={content} 
                  onWidthResize={(newWidth) => setSettings(s => ({ ...s, width: newWidth }))}
                />
              </div>
            </div>
          </div>
          
          <footer className="w-full pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>© 2024 TermiSnap • Create beautiful CLI snapshots</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Documentation</a>
              <a href="#" className="hover:text-slate-300 transition-colors flex items-center gap-1">
                <Github size={16} /> GitHub
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
