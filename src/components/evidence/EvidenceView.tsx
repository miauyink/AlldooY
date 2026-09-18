import React, { useState } from 'react';
import {
  DatabaseZap,
  Lock,
  Shield,
  FileCheck2,
  GitBranch,
  RefreshCw,
  Ban,
  CheckCircle2,
  Code,
  FileText,
  AlertCircle,
  Undo2,
} from 'lucide-react';
import { IdentityLink, ImportReceipt, ImportExclusion, Person } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';

interface EvidenceViewProps {
  identityLinks: IdentityLink[];
  receipts: ImportReceipt[];
  exclusions: ImportExclusion[];
  people: Person[];
  onRecoverExclusion?: (importKey: string) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  identityLinks,
  receipts,
  exclusions,
  people,
  onRecoverExclusion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'locks' | 'links' | 'receipts' | 'exclusions'>('locks');
  const [recoveredKeys, setRecoveredKeys] = useState<string[]>([]);

  // Collect all locked fields across all people
  const allLockedFields = people.flatMap((p) =>
    p.lockedFields.map((f) => ({
      ...f,
      personId: p.id,
      personName: p.currentNickname,
    }))
  );

  const handleRecover = (key: string) => {
    setRecoveredKeys((prev) => [...prev, key]);
    if (onRecoverExclusion) onRecoverExclusion(key);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DatabaseZap className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white tracking-wide">数据证据与约束中心</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              高保真存证溯源
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            收拢人工确认证据、负向排除关系 (Negative Links)、字段锁及流水导入排除回执
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0f131a] border border-[#1f2532] text-xs">
        <button
          onClick={() => setActiveSubTab('locks')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'locks'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>人工字段锁存证 ({allLockedFields.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('links')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'links'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>UID 身份核验与否定关系 ({identityLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exclusions')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'exclusions'
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>流水排除记录 ({exclusions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('receipts')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'receipts'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>导入入账回执 ({receipts.length})</span>
        </button>
      </div>

      {/* Subtab 1: 人工字段锁 */}
      {activeSubTab === 'locks' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#10141d] border border-cyan-500/20 text-xs space-y-1">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 字段锁机制说明
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              锁定字段表示自动抓取/导入流程不得覆盖人工确认的真实值。用于保护大客户专属资料、防私信骚扰约束及历史合并分支。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allLockedFields.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0d1016] border border-[#1f2532] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.personName}</span>
                    <span className="font-mono text-zinc-400">({item.personId})</span>
                  </div>
                  <SemanticBadge type="locked" label={`已锁 ${item.label}`} size="sm" />
                </div>

                <div className="p-2.5 rounded bg-[#141822] border border-[#232938] space-y-1">
                  <div className="text-[11px] text-cyan-300 font-mono">
                    受控字段键名: {item.field}
                  </div>
                  <div className="text-[11px] text-zinc-300">加锁事由: {item.reason}</div>
                  <div className="text-[10px] text-zinc-400 font-mono pt-1">
                    锁定时间: {item.lockedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: UID 身份核验与否定关系 */}
      {activeSubTab === 'links' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#10141d] border border-emerald-500/20 text-xs space-y-1">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> 否定关系 (Negative Links) 的重要价值
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              在日常运营中，“明确不是同一人”与“已确认是同一人”具有同等重要的架构地位。已判定的 Negative
              Link 会永久阻止相似度算法反复向运营推送错误的合并建议。
            </p>
          </div>

          <div className="space-y-3">
            {identityLinks.map((link) => (
              <div
                key={link.id}
                className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                  link.status === 'confirmed'
                    ? 'bg-[#0d1210] border-emerald-500/30'
                    : link.status === 'rejected'
                    ? 'bg-[#140d10] border-rose-500/30'
                    : 'bg-[#14120d] border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{link.uid}</span>
                    <span className="text-zinc-400">关联人物:</span>
                    <span className="font-semibold text-white">
                      {link.personName} ({link.personId})
                    </span>
                  </div>

                  <SemanticBadge
                    type={link.status === 'rejected' ? 'negative_link' : link.status}
                    size="sm"
                  />
                </div>

                <div className="p-2.5 rounded bg-[#141822] border border-[#232938] space-y-1">
                  <div className="text-[11px] text-zinc-200">
                    <strong>支撑证据:</strong> {link.evidence}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 font-mono">
                    <span>证据来源: {link.source}</span>
                    <span>确立时间: {link.createdAt}</span>
                    {link.confidence !== undefined && (
                      <span className="text-emerald-400 font-bold">
                        置信度: {(link.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: 排除记录 (Exclusions) */}
      {activeSubTab === 'exclusions' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#140f12] border border-rose-500/20 text-xs space-y-1">
            <span className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5" /> 为什么某条流水被排除
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              必须保留排除记录的完整原始快照与操作凭证，严禁物理硬删除，并支持误判时的一键回滚恢复。
            </p>
          </div>

          <div className="space-y-3">
            {exclusions.map((ex) => {
              const isRecovered = recoveredKeys.includes(ex.importKey);

              return (
                <div
                  key={ex.importKey}
                  className="p-4 rounded-xl bg-[#0d1016] border border-[#1f2532] text-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{ex.importKey}</span>
                      <SemanticBadge
                        type={isRecovered ? 'confirmed' : 'rejected'}
                        label={isRecovered ? '已撤销排除并恢复入账' : '已排除'}
                        size="sm"
                      />
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400">{ex.timestamp}</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#141822] border border-[#232938] space-y-1.5">
                    <div className="text-[11px] text-zinc-200">
                      <strong>排除原因:</strong> {ex.reason}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      <strong>经办人/规则:</strong> {ex.operator}
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        原始事件快照 (Raw Event Payload):
                      </span>
                      <pre className="p-2 rounded bg-[#090b0e] text-emerald-400 font-mono text-[11px] overflow-x-auto border border-[#1c222c]">
                        {ex.rawEventSnapshot}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400">
                      {ex.recoverable ? '系统支持安全撤销' : '不可逆排除'}
                    </span>

                    {ex.recoverable && !isRecovered && (
                      <button
                        onClick={() => handleRecover(ex.importKey)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>撤销排除并入账</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 4: 入账回执 (Receipts) */}
      {activeSubTab === 'receipts' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#10141d] border border-emerald-500/20 text-xs space-y-1">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> 导入入账回执 (Receipt) 作用
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              标识该原始事件已经处理，记录关联流水号，避免因重新上传 CSV 文件导致的二次重复入账。
            </p>
          </div>

          <div className="space-y-3">
            {receipts.map((rec) => (
              <div
                key={rec.importKey}
                className="p-4 rounded-xl bg-[#0d1016] border border-[#1f2532] text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-emerald-400">{rec.importKey}</span>
                    <span>↔</span>
                    <span className="text-white">{rec.tipId}</span>
                    <SemanticBadge type="confirmed" label="已提交 (Committed)" size="sm" />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">{rec.timestamp}</span>
                </div>

                <div className="p-2.5 rounded bg-[#141822] border border-[#232938] text-[11px] text-zinc-300">
                  {rec.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
