import React from 'react';
import {
  Search,
  Radio,
  Clock,
  Menu,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { NavTab } from '../../types';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  selectedStreamer: string;
  onSelectStreamer: (s: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingAuditCount: number;
  onNavigateTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  selectedStreamer,
  onSelectStreamer,
  searchQuery,
  onSearchChange,
  pendingAuditCount,
  onNavigateTab,
}) => {
  return (
    <header className="h-14 border-b border-[#1e232d] bg-[#0d1015]/90 backdrop-blur-md px-4 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left: Mobile Toggle & Streamer Switcher */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c222c]"
          title="打开菜单"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161a22] border border-[#262c38] text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-zinc-400">主播域:</span>
            <select
              id="select-streamer"
              value={selectedStreamer}
              onChange={(e) => onSelectStreamer(e.target.value)}
              aria-label="选择主播域"
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#141820]">全部主播</option>
              <option value="STREAMER-3" className="bg-[#141820]">STREAMER-3 (当前主推)</option>
              <option value="STREAMER-2" className="bg-[#141820]">STREAMER-2 (历史)</option>
              <option value="STREAMER-1" className="bg-[#141820]">STREAMER-1 (早期测试)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>当前场次 S-30012</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">14:13~18:14</span>
          </div>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索人物昵称、ID (P-0001)、UID、账号、打赏流水..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#141822] border border-[#232936] text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick shortcuts & Operational alerts */}
      <div className="flex items-center gap-2">
        {pendingAuditCount > 0 && (
          <button
            id="btn-quick-audit"
            onClick={() => onNavigateTab('audit')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 transition-colors text-xs font-medium"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
            <span>待审核</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold text-[10px]">
              {pendingAuditCount}
            </span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#13161d] border border-[#202530] text-xs text-zinc-400">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span className="font-mono text-[11px] text-zinc-300">2026-09-18 18:45</span>
        </div>

        <button
          id="btn-quick-evidence"
          onClick={() => onNavigateTab('evidence')}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#161a22] border border-transparent hover:border-[#262c38] transition-colors"
          title="字段锁与数据凭证"
        >
          <Lock className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
