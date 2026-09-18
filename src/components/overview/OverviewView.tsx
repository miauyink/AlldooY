import React from 'react';
import {
  Coins,
  Users,
  Radio,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Shield,
  History,
  Lock,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { Person, TipStream, LiveSession, AuditItem, NavTab } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';

interface OverviewViewProps {
  people: Person[];
  tips: TipStream[];
  sessions: LiveSession[];
  audits: AuditItem[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectPersonById: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  people,
  tips,
  sessions,
  audits,
  onNavigateTab,
  onSelectPersonById,
}) => {
  // Aggregate stats
  const totalTipAmount = people.reduce((acc, curr) => acc + curr.totalTipAmount, 0);
  const pendingAudits = audits.filter((a) => a.status === 'pending');
  const currentSession = sessions.find((s) => s.id === 'S-30012') || sessions[0];

  // Top 5 contributors ranking
  const topPeople = [...people]
    .sort((a, b) => b.totalTipAmount - a.totalTipAmount)
    .slice(0, 5);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner: Today / Current Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Today / Current Live Session */}
        <div className="p-4 rounded-xl bg-[#0f131b] border border-[#1f2635] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-300">今日 / 当前场次</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              {currentSession.id} · 完整采集
            </span>
          </div>

          <div>
            <span className="text-[11px] text-zinc-400 block">本场打赏总额</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                ¥{typeof currentSession.tipTotalAmount === 'number'
                  ? currentSession.tipTotalAmount.toLocaleString()
                  : '—'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {currentSession.contributorCount} 人贡献流水
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b212f] flex items-center justify-between text-[11px] text-zinc-400">
            <span>主播: {currentSession.streamerAccount}</span>
            <button
              onClick={() => onNavigateTab('sessions')}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              场次归档 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Cumulative Platform Stats */}
        <div className="p-4 rounded-xl bg-[#0f131b] border border-[#1f2635] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-300">全周期累计打赏</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">不随调价重算</span>
          </div>

          <div>
            <span className="text-[11px] text-zinc-400 block">总盘存金额</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono text-white">
                ¥{totalTipAmount.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400 font-mono">{people.length} 位档案人物</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b212f] flex items-center justify-between text-[11px] text-zinc-400">
            <span>已入账流水: {tips.length} 笔</span>
            <button
              onClick={() => onNavigateTab('tips')}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              查看明细 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Pending Audits & Warnings */}
        <div
          className={`p-4 rounded-xl border space-y-3 ${
            pendingAudits.length > 0
              ? 'bg-[#15120c] border-amber-500/40'
              : 'bg-[#0f131b] border-[#1f2635]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">待审核与冲突预警</span>
            </div>
            {pendingAudits.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold font-mono">
                {pendingAudits.length} 项待决
              </span>
            )}
          </div>

          <div>
            <span className="text-[11px] text-zinc-400 block">最高优先级待办</span>
            <p className="text-xs text-zinc-200 mt-1 line-clamp-1 font-medium">
              {pendingAudits.length > 0 ? pendingAudits[0].title : '当前暂无异常冲突，数据流正常'}
            </p>
          </div>

          <div className="pt-2 border-t border-[#2a2416] flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">涉及身份、未知礼物与排除</span>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              立即进入审核 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Top Contributors + Recent 3-Session Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Top Contributors with Contribution Distribution */}
        <div className="lg:col-span-2 rounded-xl bg-[#0d1016] border border-[#1f2532] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>核心人物贡献榜 (Top 5)</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                当前昵称与历史昵称统一映射，累计打赏占比分析
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('people')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              全部人物 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {topPeople.map((person, index) => {
              const percentage = totalTipAmount > 0 ? (person.totalTipAmount / totalTipAmount) * 100 : 0;
              const rankLabels = ['榜一', '榜二', '榜三', '榜四', '榜五'];
              const rankColors = [
                'bg-amber-500/20 text-amber-300 border-amber-500/40',
                'bg-zinc-700/40 text-zinc-200 border-zinc-600/40',
                'bg-amber-950/40 text-amber-400 border-amber-800/40',
                'bg-zinc-800/40 text-zinc-400 border-zinc-700/40',
                'bg-zinc-800/40 text-zinc-400 border-zinc-700/40',
              ];

              return (
                <div
                  key={person.id}
                  onClick={() => {
                    onNavigateTab('people');
                    onSelectPersonById(person.id);
                  }}
                  className="p-3 rounded-lg bg-[#121620] border border-[#1e2533] hover:border-emerald-500/40 hover:bg-[#151a26] transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${rankColors[index]}`}
                      >
                        {rankLabels[index]}
                      </span>
                      <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {person.currentNickname}
                      </span>
                      {person.petName && (
                        <span className="text-[10px] text-zinc-400">({person.petName})</span>
                      )}
                      <span className="font-mono text-[10px] text-zinc-400">{person.id}</span>
                      {person.lockedFields.length > 0 && (
                        <span title="存在字段锁定" className="text-cyan-400">
                          <Lock className="w-3 h-3 inline" />
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        ¥{person.totalTipAmount.toLocaleString()}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] ml-2">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#1e2533] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        index === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : index === 1
                          ? 'bg-emerald-500/80'
                          : 'bg-emerald-600/60'
                      }`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent 3-Session Comparison & Trend */}
        <div className="rounded-xl bg-[#0d1016] border border-[#1f2532] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>近 3 场场次趋势</span>
              </h2>
              <p className="text-[11px] text-zinc-400">包含早期未采集与当前场次</p>
            </div>
            <button
              onClick={() => onNavigateTab('sessions')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              全部场次 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg bg-[#121620] border border-[#1e2533] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{s.id}</span>
                  <SemanticBadge type={s.dataIntegrity} size="sm" />
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                  <span>{s.startTime.split(' ')[0]}</span>
                  <span>{s.streamerAccount}</span>
                </div>

                <div className="pt-1 border-t border-[#1a202c] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">场次打赏:</span>
                  {s.tipTotalAmount === 'not_collected' ? (
                    <SemanticBadge type="not_collected" label="当时未采集" size="sm" />
                  ) : (
                    <span className="font-mono font-bold text-emerald-400">
                      ¥{s.tipTotalAmount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Matrix: Recent Activity & Audit Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Profile & Relationship Events */}
        <div className="rounded-xl bg-[#0d1016] border border-[#1f2532] p-4 space-y-3">
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-emerald-400" />
            近期资料与关系演变动态
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#121620] border border-[#1e2533] flex items-start justify-between gap-2">
              <div>
                <span className="font-medium text-white">小星 (P-0007) 经历多次更名</span>
                <span className="text-zinc-400 text-[11px] block mt-0.5">
                  星星 → 小星星 → 别认出我 → 小星 (当前生效)
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">2026-09-08</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#121620] border border-[#1e2533] flex items-start justify-between gap-2">
              <div>
                <span className="font-medium text-white">小满 (P-0003) 确认绑定小号 A-004</span>
                <span className="text-zinc-400 text-[11px] block mt-0.5">
                  由早期单账号演进为主副多账号矩阵
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">2026-08-20</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#121620] border border-[#1e2533] flex items-start justify-between gap-2">
              <div>
                <span className="font-medium text-white">云边 (P-0004) 确立历史分支 P-0104</span>
                <span className="text-zinc-400 text-[11px] block mt-0.5">
                  原 8 笔流水保留，原人物资料完整存证归档
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">2026-08-12</span>
            </div>
          </div>
        </div>

        {/* Audit Queue Highlights */}
        <div className="rounded-xl bg-[#0d1016] border border-[#1f2532] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              待处理冲突专栏
            </h3>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              全部处理 →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {pendingAudits.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab('audit')}
                className="p-2.5 rounded-lg bg-[#16140e] border border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-[11px]">{item.title}</span>
                  <SemanticBadge type="pending" size="sm" />
                </div>
                <p className="text-[11px] text-zinc-300 line-clamp-1">{item.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
