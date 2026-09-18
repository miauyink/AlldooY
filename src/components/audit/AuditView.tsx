import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Gift,
  Users,
  Shield,
  Filter,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { AuditItem } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';

interface AuditViewProps {
  audits: AuditItem[];
  onResolveAudit: (id: string, action: 'confirmed' | 'rejected' | 'postponed') => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ audits, onResolveAudit }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: 'confirmed' | 'rejected' | 'postponed') => {
    onResolveAudit(id, action);
    const actionText =
      action === 'confirmed' ? '已确认通过' : action === 'rejected' ? '已驳回拒绝' : '已标记稍后处理';
    setFeedbackMessage(`审核单 ${id} ${actionText}。`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredAudits = audits.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  const pendingCount = audits.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-wide">数据审核中心</h1>
            {pendingCount > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                {pendingCount} 待审核
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                所有审核已处理完毕
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            集中审核身份关系冲突、疑似重复人物、未知礼物映射与导入排除项
          </p>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0f131a] border border-[#1f2532] text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === 'ALL'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            全部类型
          </button>
          <button
            onClick={() => setFilterType('duplicate_person')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === 'duplicate_person'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            疑似重复人物
          </button>
          <button
            onClick={() => setFilterType('identity_link')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === 'identity_link'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            推测账号绑定
          </button>
          <button
            onClick={() => setFilterType('unknown_gift')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === 'unknown_gift'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            未知礼物映射
          </button>
          <button
            onClick={() => setFilterType('import_exclusion')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filterType === 'import_exclusion'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            导入排除审查
          </button>
        </div>

        {/* Status switch */}
        <div className="flex items-center gap-1 bg-[#141822] p-1 rounded-lg border border-[#232938]">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            待处理 ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            所有记录 ({audits.length})
          </button>
        </div>
      </div>

      {/* Audit Items List */}
      <div className="space-y-3">
        {filteredAudits.map((item) => {
          const isPending = item.status === 'pending';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                isPending
                  ? 'bg-[#0d1016] border-amber-500/30 hover:border-amber-500/50'
                  : item.status === 'confirmed'
                  ? 'bg-[#0d1210] border-emerald-500/20 opacity-80'
                  : item.status === 'rejected'
                  ? 'bg-[#140d10] border-rose-500/20 opacity-80'
                  : 'bg-[#101216] border-zinc-700/30 opacity-80'
              }`}
            >
              {/* Top info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b202a] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-zinc-400">{item.id}</span>
                  <h3 className="font-bold text-white text-xs">{item.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#161b24] text-zinc-300 border border-[#263040]">
                    {item.type === 'duplicate_person'
                      ? '重复人物'
                      : item.type === 'identity_link'
                      ? '身份关联'
                      : item.type === 'unknown_gift'
                      ? '未知礼物'
                      : '导入排除'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span>{item.createdAt}</span>
                  <SemanticBadge
                    type={
                      item.status === 'confirmed'
                        ? 'confirmed'
                        : item.status === 'rejected'
                        ? 'rejected'
                        : 'pending'
                    }
                    label={
                      item.status === 'confirmed'
                        ? '已核准'
                        : item.status === 'rejected'
                        ? '已驳回'
                        : item.status === 'postponed'
                        ? '已稍后处理'
                        : '待审核'
                    }
                    size="sm"
                  />
                </div>
              </div>

              {/* Problem, Suggestion, Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Problem */}
                <div className="p-3 rounded-lg bg-[#141822] border border-[#232938] space-y-1">
                  <span className="text-zinc-400 text-[10px] font-semibold block uppercase">
                    1. 发现的问题
                  </span>
                  <p className="text-zinc-200 text-[11px] leading-relaxed">{item.problem}</p>
                  <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                    涉及实体: {item.currentEntity}
                    {item.candidateEntity && ` ↔ ${item.candidateEntity}`}
                  </div>
                </div>

                {/* Evidence */}
                <div className="p-3 rounded-lg bg-[#141822] border border-[#232938] space-y-1">
                  <span className="text-amber-400 text-[10px] font-semibold block uppercase">
                    2. 证据与置信度
                  </span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{item.evidence}</p>
                  <div className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between">
                    <span>来源: {item.source}</span>
                    {item.confidence !== undefined && (
                      <span className="font-mono text-amber-300 font-bold">
                        置信度: {(item.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Suggestion & Scope */}
                <div className="p-3 rounded-lg bg-[#141822] border border-[#232938] space-y-1">
                  <span className="text-emerald-400 text-[10px] font-semibold block uppercase">
                    3. 系统建议与影响
                  </span>
                  <p className="text-zinc-200 text-[11px] leading-relaxed">{item.suggestion}</p>
                  <div className="text-[10px] text-zinc-400 mt-1">影响范围: {item.scope}</div>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="pt-2 border-t border-[#1b202a] flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {isPending ? '审核决策操作：' : `审核结果: ${item.status}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(item.id, 'postponed')}
                    className="px-3 py-1.5 rounded-lg bg-[#161a24] text-zinc-300 hover:text-white hover:bg-[#202736] border border-[#262f3f] text-xs font-medium transition-colors"
                  >
                    稍后处理
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/30 text-xs font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>驳回 / 排除</span>
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'confirmed')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>核准通过</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAudits.length === 0 && (
          <div className="p-12 text-center space-y-2 rounded-xl border border-[#1f2532] bg-[#0d1016]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-medium text-zinc-200">当前分类无待审核项目</div>
            <p className="text-xs text-zinc-400">所有数据冲突与推测关系处于受控状态</p>
          </div>
        )}
      </div>
    </div>
  );
};
