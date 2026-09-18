import React from 'react';
import {
  LayoutDashboard,
  Users,
  Coins,
  Gift,
  Radio,
  FileCheck2,
  DatabaseZap,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from '../../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingAuditCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingAuditCount,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number; desc: string }> = [
    {
      id: 'overview',
      label: '总览',
      icon: <LayoutDashboard className="w-4 h-4" />,
      desc: '场次动态与核心统计',
    },
    {
      id: 'people',
      label: '人物档案',
      icon: <Users className="w-4 h-4" />,
      desc: '人物关系、主/副账号、分支',
    },
    {
      id: 'tips',
      label: '打赏流水',
      icon: <Coins className="w-4 h-4" />,
      desc: '事件时间与结算日明细',
    },
    {
      id: 'gifts',
      label: '礼物价格',
      icon: <Gift className="w-4 h-4" />,
      desc: '价格历史与防反算保护',
    },
    {
      id: 'sessions',
      label: '直播场次',
      icon: <Radio className="w-4 h-4" />,
      desc: '完整度分类与场次归档',
    },
    {
      id: 'audit',
      label: '数据审核',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: pendingAuditCount,
      desc: '身份关系与异常核对',
    },
    {
      id: 'evidence',
      label: '数据证据',
      icon: <DatabaseZap className="w-4 h-4" />,
      desc: '字段锁、关联图谱与凭证',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0d1015] border-r border-[#1e232d] w-64 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1e232d] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 text-black font-bold text-base tracking-wider">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white">AlldooY</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">人物与打赏运营中心</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          运营工作台
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group text-left ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161a22] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'}>
                  {item.icon}
                </span>
                <div>
                  <span className="block leading-tight">{item.label}</span>
                  <span className="text-[10px] text-zinc-400 leading-none mt-0.5 block truncate max-w-[130px]">
                    {item.desc}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'opacity-100 text-emerald-400' : 'opacity-0 group-hover:opacity-40'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Status & System Principle Notice */}
      <div className="p-3 border-t border-[#1e232d] bg-[#0a0c10]/70 text-[11px]">
        <div className="p-2.5 rounded-lg bg-[#141820] border border-[#212733] space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>核心原则遵从</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            当前值 ≠ 历史值 · 缺失 ≠ 0 · 自动推测不伪装人工确认
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block h-screen shrink-0 sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
