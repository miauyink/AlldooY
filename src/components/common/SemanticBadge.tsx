import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Lock,
  HelpCircle,
  AlertTriangle,
  GitBranch,
  Archive,
  ShieldCheck,
  Ban,
  CircleDashed,
} from 'lucide-react';

export type SemanticType =
  | 'confirmed'
  | 'pending'
  | 'rejected'
  | 'locked'
  | 'not_collected'
  | 'unknown'
  | 'no_record'
  | 'active'
  | 'inactive'
  | 'archived'
  | 'merged'
  | 'time_only'
  | 'partial'
  | 'full'
  | 'anonymous'
  | 'negative_link';

interface SemanticBadgeProps {
  type: SemanticType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const SemanticBadge: React.FC<SemanticBadgeProps> = ({
  type,
  label,
  size = 'sm',
  className = '',
  showIcon = true,
}) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (type) {
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
          <span>{label || '已确认'}</span>
        </span>
      );

    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-amber-500/30 bg-amber-950/40 text-amber-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <Clock className="w-3 h-3 text-amber-400 shrink-0" />}
          <span>{label || '待确认 / 推测'}</span>
        </span>
      );

    case 'rejected':
    case 'negative_link':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-rose-500/30 bg-rose-950/40 text-rose-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <Ban className="w-3 h-3 text-rose-400 shrink-0" />}
          <span>{label || (type === 'negative_link' ? '已排除 (非同一人)' : '已拒绝')}</span>
        </span>
      );

    case 'locked':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 ${sizeClasses} ${className}`}
        >
          {showIcon && <Lock className="w-3 h-3 text-cyan-300 shrink-0" />}
          <span>{label || '人工锁定'}</span>
        </span>
      );

    case 'not_collected':
      return (
        <span
          title="当时系统未采集此信息，不代表数值为0或不存在"
          className={`inline-flex items-center gap-1 font-medium rounded border border-dashed border-zinc-600 bg-zinc-900/60 text-zinc-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <CircleDashed className="w-3 h-3 text-zinc-400 shrink-0" />}
          <span>{label || '当时未采集'}</span>
        </span>
      );

    case 'unknown':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-zinc-700 bg-zinc-900/40 text-zinc-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <HelpCircle className="w-3 h-3 text-zinc-400 shrink-0" />}
          <span>{label || '当前未知'}</span>
        </span>
      );

    case 'no_record':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-slate-700 bg-slate-900/40 text-slate-400 ${sizeClasses} ${className}`}
        >
          {showIcon && <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />}
          <span>{label || '暂无记录'}</span>
        </span>
      );

    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>{label || '活跃中'}</span>
        </span>
      );

    case 'inactive':
    case 'archived':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-zinc-800 bg-zinc-900/50 text-zinc-500 ${sizeClasses} ${className}`}
        >
          {showIcon && <Archive className="w-3 h-3 text-zinc-500 shrink-0" />}
          <span>{label || (type === 'archived' ? '已归档' : '已停用')}</span>
        </span>
      );

    case 'merged':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-purple-500/30 bg-purple-950/40 text-purple-300 ${sizeClasses} ${className}`}
        >
          {showIcon && <GitBranch className="w-3 h-3 text-purple-300 shrink-0" />}
          <span>{label || '已合并分支'}</span>
        </span>
      );

    case 'time_only':
      return (
        <span
          title="此场次仅记录开始与结束时间，缺少详细弹幕及明细数据"
          className={`inline-flex items-center gap-1 font-medium rounded border border-amber-500/20 bg-amber-950/20 text-amber-300 ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-300 shrink-0" />
          <span>{label || '仅时间记录'}</span>
        </span>
      );

    case 'partial':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-blue-500/30 bg-blue-950/30 text-blue-300 ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-blue-300 shrink-0" />
          <span>{label || '部分记录'}</span>
        </span>
      );

    case 'full':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 ${sizeClasses} ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{label || '完整场次'}</span>
        </span>
      );

    case 'anonymous':
      return (
        <span
          title="匿名事件：不与人物建立永久UID关联"
          className={`inline-flex items-center gap-1 font-medium rounded border border-zinc-700 bg-zinc-800/80 text-zinc-300 ${sizeClasses} ${className}`}
        >
          <HelpCircle className="w-3 h-3 text-zinc-400 shrink-0" />
          <span>{label || '匿名事件'}</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded bg-zinc-800 text-zinc-300 ${sizeClasses} ${className}`}>
          <span>{label}</span>
        </span>
      );
  }
};
