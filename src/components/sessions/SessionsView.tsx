import React, { useState } from 'react';
import {
  Radio,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Users,
  Coins,
  MessageSquare,
  Activity,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';
import { LiveSession, TipStream } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';
import { Drawer } from '../common/Drawer';

interface SessionsViewProps {
  sessions: LiveSession[];
  tips: TipStream[];
}

export const SessionsView: React.FC<SessionsViewProps> = ({ sessions, tips }) => {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenSession = (s: LiveSession) => {
    setSelectedSession(s);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">直播场次管理</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              共 {sessions.length} 场记录
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            支持完整场次、部分记录场次与历史「仅时间记录」场次，优雅表达历史数据缺失
          </p>
        </div>
      </div>

      {/* Semantic notice */}
      <div className="p-3.5 rounded-xl bg-[#121622] border border-[#232d3f] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-zinc-300 space-y-0.5">
          <span className="font-semibold text-blue-300">历史数据完整度语义约定</span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            某些早期场次（如 S-10001）仅抓取了开播与下播起止日志，当时尚未上线弹幕抓取及收益对账模块。
            界面严谨标注为「当时未采集」或「仅时间记录」，绝对禁止渲染为页面崩溃、加载失败或错误判定为 0 元场次。
          </p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((sess) => {
          const sessionTips = tips.filter((t) => t.sessionId === sess.id);
          const isTimeOnly = sess.dataIntegrity === 'time_only';

          return (
            <div
              key={sess.id}
              onClick={() => handleOpenSession(sess)}
              className="p-4 rounded-xl bg-[#0d1016] border border-[#1f2532] hover:border-emerald-500/40 hover:bg-[#121620] transition-all cursor-pointer space-y-3.5 group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#181d27] border border-[#273040] flex items-center justify-center text-zinc-200 font-bold font-mono text-xs">
                    {sess.id.replace('S-', '')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors font-mono">
                      {sess.id}
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {sess.streamerAccount}
                    </span>
                  </div>
                </div>

                <SemanticBadge type={sess.dataIntegrity} size="sm" />
              </div>

              {/* Time window */}
              <div className="p-2.5 rounded-lg bg-[#141822] border border-[#232938] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 开播 ~ 结播
                  </span>
                </div>
                <div className="font-mono text-white text-[11px] flex items-center justify-between">
                  <span>{sess.startTime}</span>
                  <span className="text-zinc-400">至</span>
                  <span>{sess.endTime.split(' ')[1]}</span>
                </div>
              </div>

              {/* Metrics block */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#131720] border border-[#1f2634]">
                  <span className="text-zinc-400 text-[10px] block">打赏总金额</span>
                  {sess.tipTotalAmount === 'not_collected' ? (
                    <SemanticBadge type="not_collected" label="当时未采集" size="sm" />
                  ) : (
                    <span className="font-bold font-mono text-emerald-400 text-sm">
                      ¥{sess.tipTotalAmount.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="p-2 rounded bg-[#131720] border border-[#1f2634]">
                  <span className="text-zinc-400 text-[10px] block">打赏人数</span>
                  {sess.contributorCount === 'not_collected' ? (
                    <SemanticBadge type="not_collected" label="当时未采集" size="sm" />
                  ) : (
                    <span className="font-bold font-mono text-white text-sm">
                      {sess.contributorCount} 人
                    </span>
                  )}
                </div>
              </div>

              {/* Module Integrity Indicators */}
              <div className="space-y-1.5 pt-1 border-t border-[#1b212d] text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">弹幕评论数据:</span>
                  <SemanticBadge type={sess.commentsStatus} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">在线人数曲线:</span>
                  <SemanticBadge type={sess.onlineAudienceStatus} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">复盘核实记录:</span>
                  <SemanticBadge type={sess.reviewStatus} size="sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Detail Drawer */}
      {selectedSession && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width="max-w-xl"
          title={
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>场次明细与归档档案: {selectedSession.id}</span>
            </div>
          }
          subtitle={
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-zinc-400">主播: {selectedSession.streamerAccount}</span>
              <span>•</span>
              <SemanticBadge type={selectedSession.dataIntegrity} size="sm" />
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Integrity Diagnosis */}
            <div className="p-3.5 rounded-lg bg-[#141822] border border-[#232938] space-y-1.5">
              <span className="font-semibold text-zinc-200 block text-xs">场次特征与完整度说明</span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {selectedSession.notes}
              </p>
            </div>

            {/* Time Breakdown */}
            <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-2">
              <h4 className="text-zinc-300 font-semibold uppercase text-[11px]">时间周期</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block">开播时间点</span>
                  <span className="font-mono text-white">{selectedSession.startTime}</span>
                </div>
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block">结播时间点</span>
                  <span className="font-mono text-white">{selectedSession.endTime}</span>
                </div>
              </div>
            </div>

            {/* Modules status */}
            <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-2">
              <h4 className="text-zinc-300 font-semibold uppercase text-[11px]">采集模块状态明细</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b202a]">
                  <span className="text-zinc-400">打赏流水核对</span>
                  {selectedSession.tipTotalAmount === 'not_collected' ? (
                    <SemanticBadge type="not_collected" />
                  ) : (
                    <span className="font-mono text-emerald-400 font-bold">
                      ¥{selectedSession.tipTotalAmount} (已核验)
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b202a]">
                  <span className="text-zinc-400">弹幕评论采集</span>
                  <SemanticBadge type={selectedSession.commentsStatus} />
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#1b202a]">
                  <span className="text-zinc-400">在线人数波动采样</span>
                  <SemanticBadge type={selectedSession.onlineAudienceStatus} />
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-zinc-400">主播对账复盘状态</span>
                  <SemanticBadge type={selectedSession.reviewStatus} />
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
