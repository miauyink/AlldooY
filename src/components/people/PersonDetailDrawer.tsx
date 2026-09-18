import React, { useState } from 'react';
import {
  User,
  Shield,
  Lock,
  GitBranch,
  Coins,
  History,
  FileText,
  Database,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { Person, Account, TipStream, IdentityLink } from '../../types';
import { Drawer } from '../common/Drawer';
import { SemanticBadge } from '../common/SemanticBadge';

interface PersonDetailDrawerProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  tips: TipStream[];
  identityLinks: IdentityLink[];
  onSelectPerson?: (personId: string) => void;
}

type DetailTab = 'overview' | 'accounts' | 'tips' | 'history' | 'branches' | 'evidence';

export const PersonDetailDrawer: React.FC<PersonDetailDrawerProps> = ({
  person,
  isOpen,
  onClose,
  accounts,
  tips,
  identityLinks,
  onSelectPerson,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!person) return null;

  const personAccounts = accounts.filter((a) => a.personId === person.id);
  const personTips = tips.filter((t) => t.personId === person.id);
  const personLinks = identityLinks.filter((l) => l.personId === person.id);

  // Tab configurations
  const tabs: Array<{ id: DetailTab; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'overview', label: '概览', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'accounts', label: '账号矩阵', icon: <Database className="w-3.5 h-3.5" />, count: personAccounts.length },
    { id: 'tips', label: '打赏流水', icon: <Coins className="w-3.5 h-3.5" />, count: personTips.length },
    { id: 'history', label: '演化历史', icon: <History className="w-3.5 h-3.5" />, count: person.nicknameHistory.length },
    {
      id: 'branches',
      label: '分支与备注',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      count: person.branches?.length || 0,
    },
    {
      id: 'evidence',
      label: '数据证据',
      icon: <Shield className="w-3.5 h-3.5" />,
      count: person.lockedFields.length + personLinks.length,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm">
            {person.currentNickname.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base">{person.currentNickname}</span>
              {person.petName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  爱称: {person.petName}
                </span>
              )}
              {person.title && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {person.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
              <span>{person.id}</span>
              <span>•</span>
              <span>首次出现: {person.firstSeen}</span>
              <span>•</span>
              <span>最近活跃: {person.lastActive}</span>
            </div>
          </div>
        </div>
      }
      subtitle={
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <SemanticBadge type={person.currentStatus} />
          {person.currentLevel === 'not_collected' ? (
            <SemanticBadge type="not_collected" label="等级: 当时未采集" />
          ) : person.currentLevel === 'unknown' ? (
            <SemanticBadge type="unknown" label="等级: 当前未知" />
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-semibold">
              Lv.{person.currentLevel}
            </span>
          )}
          {person.forbidPrivateChat && (
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950/30 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Ban className="w-3 h-3" />
              禁止私聊
            </span>
          )}
          {person.lockedFields.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              已锁定 {person.lockedFields.length} 项字段
            </span>
          )}
          {person.hasPendingAudit && (
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              待审核待办
            </span>
          )}
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              累计打赏:{' '}
              <strong className="text-emerald-400 font-mono text-sm">
                ¥{person.totalTipAmount.toLocaleString()}
              </strong>
            </span>
            <span>
              流水数: <strong className="text-zinc-200 font-mono">{person.tipCount}</strong>
            </span>
            <span>
              账号数: <strong className="text-zinc-200 font-mono">{person.accountCount}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#1f2633] text-zinc-200 hover:bg-[#283244] text-xs font-medium transition-colors"
          >
            完成查看
          </button>
        </div>
      }
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#1f2532] pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-[#141923]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#12161f]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: 概览 (Overview) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Locked fields reminder banner if any */}
          {person.lockedFields.length > 0 && (
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-cyan-300">人工加锁保护项</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  以下字段已锁定，自动爬虫或导入脚本禁止覆盖：
                  {person.lockedFields.map((f) => `「${f.label} (${f.reason})」`).join('、')}
                </p>
              </div>
            </div>
          )}

          {/* Pending Audit banner */}
          {person.hasPendingAudit && (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-amber-300">存在待审核事项</span>
                <p className="text-zinc-300 text-[11px]">{person.pendingAuditReason}</p>
              </div>
            </div>
          )}

          {/* Core Profile Fields */}
          <div className="rounded-lg bg-[#12151d] border border-[#1f2532] p-4 space-y-4">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              人物档案基本资料
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1">
                <span className="text-zinc-400 block text-[11px]">当前昵称</span>
                <div className="flex items-center gap-1.5 font-medium text-white">
                  <span>{person.currentNickname}</span>
                  {person.lockedFields.some((f) => f.field === 'nickname') && (
                    <SemanticBadge type="locked" label="已锁定" size="sm" />
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1">
                <span className="text-zinc-400 block text-[11px]">抖音主页状态</span>
                <div className="flex items-center justify-between">
                  {person.profileStatus === 'not_collected' ? (
                    <SemanticBadge type="not_collected" label="当时未采集 (非确认无主页)" />
                  ) : person.profileStatus === 'no_record' ? (
                    <SemanticBadge type="no_record" label="主页暂无记录" />
                  ) : person.profileUrl ? (
                    <div className="flex items-center gap-1.5">
                      <SemanticBadge type="confirmed" label="主页已核验" />
                      <a
                        href={person.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        链接 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <SemanticBadge type="unknown" label="未确认主页" />
                  )}
                  {person.lockedFields.some((f) => f.field === 'profileUrl') && (
                    <SemanticBadge type="locked" label="主页锁" size="sm" />
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1">
                <span className="text-zinc-400 block text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" /> 所在地
                </span>
                <span className="font-medium text-zinc-200">
                  {person.profileLocation || <SemanticBadge type="not_collected" label="未登记" />}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1">
                <span className="text-zinc-400 block text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-400" /> 生日
                </span>
                <span className="font-medium text-zinc-200">
                  {person.profileBirthday || <SemanticBadge type="not_collected" label="未登记" />}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1 sm:col-span-2">
                <span className="text-zinc-400 block text-[11px] flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-zinc-400" /> 职业 / 行业背景
                </span>
                <span className="font-medium text-zinc-200">
                  {person.profileJob || <SemanticBadge type="not_collected" label="未采集" />}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] space-y-1 sm:col-span-2">
                <span className="text-zinc-400 block text-[11px] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-zinc-400" /> 个人简介 / 个性签名
                </span>
                <p className="text-zinc-300 text-xs italic bg-[#0f1218] p-2 rounded border border-[#1e232d]">
                  {person.profileBio || '「未采集个人简介」'}
                </p>
              </div>
            </div>

            {/* Tags & Songlist if present */}
            <div className="space-y-2 pt-2 border-t border-[#1f2532]">
              <span className="text-zinc-400 block text-[11px]">人物标签分类</span>
              <div className="flex flex-wrap gap-1.5">
                {person.tags.length > 0 ? (
                  person.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-xs bg-[#1a202c] text-zinc-300 border border-[#2d3748]"
                    >
                      #{t}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-400 text-xs italic">暂无标签</span>
                )}
                {person.songListCount !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-950/40 text-purple-300 border border-purple-500/30">
                    🎵 已点歌单: {person.songListCount} 首
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 账号 (Accounts) */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] flex items-center justify-between">
            <div className="text-xs text-zinc-300">
              已关联账号矩阵: <strong className="text-emerald-400 font-mono">{personAccounts.length}</strong> 个
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>严格区分人工确认与算法推测</span>
            </div>
          </div>

          {personAccounts.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#12151d] border border-dashed border-zinc-700 space-y-2">
              <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="text-sm font-medium text-zinc-300">当前人物未采集到账号明细</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                早期场次仅抓取了文本昵称，历史账号处于未知状态（缺失不等于不存在）。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {personAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    acc.role === 'main'
                      ? 'bg-[#141a24] border-emerald-500/30'
                      : 'bg-[#12151d] border-[#1f2532]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">{acc.displayName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            acc.role === 'main'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {acc.role === 'main' ? '主号' : acc.role === 'sub' ? '小号' : '历史账号'}
                        </span>
                        <SemanticBadge type={acc.confirmationStatus} size="sm" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono">
                        <span>账号ID: {acc.id}</span>
                        <span>UID: {acc.uid}</span>
                        <span>抖音号: {acc.douyinId}</span>
                        <span>profileKey: {acc.profileKey}</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-zinc-400">
                      <div>来源: {acc.dataSource}</div>
                      <div>最近核准: {acc.lastConfirmedAt}</div>
                    </div>
                  </div>

                  {acc.notes && (
                    <p className="mt-2 text-[11px] text-zinc-400 bg-[#0d1016] p-2 rounded border border-[#1b202a]">
                      {acc.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 打赏 (Tipping Streams) */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] flex items-center justify-between text-xs">
            <span className="text-zinc-300">
              打赏记录总计: <strong className="text-emerald-400 font-mono">{personTips.length}</strong> 笔
            </span>
            <span className="text-zinc-400 text-[11px]">
              核心原则: 事件时间 ≠ 结算日 ≠ 录入时间
            </span>
          </div>

          {personTips.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#12151d] border border-dashed border-zinc-700 space-y-2">
              <Coins className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="text-sm font-medium text-zinc-300">暂无打赏流水记录</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                无打赏记录不等于此人物不重要或为垃圾数据，粉丝互动或歌单信息仍完整保留。
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#1f2532]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#141822] text-zinc-400 font-medium text-[11px] border-b border-[#1f2532]">
                  <tr>
                    <th className="p-2.5">流水号</th>
                    <th className="p-2.5">当时快照昵称</th>
                    <th className="p-2.5">礼物与数量</th>
                    <th className="p-2.5">结算总额</th>
                    <th className="p-2.5">事件时间</th>
                    <th className="p-2.5">结算日</th>
                    <th className="p-2.5">场次</th>
                    <th className="p-2.5">属性</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b202a] text-zinc-300">
                  {personTips.map((tip) => (
                    <tr key={tip.id} className="hover:bg-[#141822]/60 transition-colors">
                      <td className="p-2.5 font-mono text-[11px] text-zinc-400">{tip.id}</td>
                      <td className="p-2.5 font-medium text-white">
                        {tip.senderSnapshotName}
                        {tip.senderSnapshotName !== person.currentNickname && (
                          <span className="ml-1 text-[10px] text-amber-400/80">(历史快照)</span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <span className="text-zinc-200">{tip.giftName}</span>
                        <span className="text-zinc-400 ml-1">× {tip.quantity}</span>
                      </td>
                      <td className="p-2.5 font-mono font-semibold text-emerald-400">
                        ¥{tip.totalAmount}
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-zinc-400">{tip.eventTime}</td>
                      <td className="p-2.5 font-mono text-[11px] text-zinc-400">{tip.settlementDate}</td>
                      <td className="p-2.5 font-mono text-[11px] text-zinc-400">{tip.sessionId}</td>
                      <td className="p-2.5">
                        {tip.isAnonymous ? (
                          <SemanticBadge type="anonymous" size="sm" />
                        ) : (
                          <SemanticBadge type="confirmed" label="已入账" size="sm" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: 演化历史 (Timeline) */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] text-xs text-zinc-300">
            <span className="font-semibold text-emerald-400">人物档案演进历程</span>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              帮助运营快速理解：“这个人物是怎样逐渐形成今天这个档案的”，完整保留每个时期的快照。
            </p>
          </div>

          {/* Nickname Evolution */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              曾用昵称变更时间轴
            </h4>

            <div className="relative pl-6 border-l border-[#262e3d] space-y-3 py-1">
              {person.nicknameHistory.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0d1016]" />
                  <div className="p-2.5 rounded bg-[#131720] border border-[#1f2532] text-xs flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white">{item.nickname}</span>
                      {item.reason && <span className="text-zinc-400 text-[11px] ml-2">({item.reason})</span>}
                    </div>
                    <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Level Progression */}
          <div className="space-y-2 pt-3 border-t border-[#1f2532]">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              等级历史轨迹 (后期等级禁止反向覆盖早期)
            </h4>

            <div className="space-y-2">
              {person.levelHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#131720] border border-[#1f2532] text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400">{item.date}</span>
                    {typeof item.level === 'number' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs font-mono">
                        Lv.{item.level}
                      </span>
                    ) : (
                      <SemanticBadge type={item.level} />
                    )}
                    {item.note && <span className="text-zinc-400 text-[11px]">{item.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: 分支与备注 (Branches & Notes) */}
      {activeTab === 'branches' && (
        <div className="space-y-5">
          <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] text-xs text-zinc-300">
            <span className="font-semibold text-purple-400">历史分支人物树 (禁止当作垃圾数据删除)</span>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              人物可能存在最终人物与历史分支人物。分支仍保留原ID、原昵称、原始流水及独立凭证。
            </p>
          </div>

          {/* Branch Tree View */}
          <div className="p-4 rounded-lg bg-[#131720] border border-[#1f2532] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>最终人物: {person.currentNickname} ({person.id})</span>
            </div>

            <div className="pl-6 space-y-3 relative border-l-2 border-[#262e3d]">
              <div className="relative flex items-center gap-2 text-xs text-emerald-300">
                <span className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                <span>├─ 当前主档案: {person.currentNickname} (现役主账号)</span>
              </div>

              {person.branches && person.branches.length > 0 ? (
                person.branches.map((b, idx) => (
                  <div
                    key={idx}
                    className="relative p-3 rounded-lg bg-[#171c26] border border-purple-500/30 text-xs space-y-2"
                  >
                    <span className="absolute -left-[27px] top-4 w-2 h-2 rounded-full bg-purple-400" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-300">└─ 历史分支: {b.originalNickname}</span>
                        <span className="font-mono text-[11px] text-zinc-400">({b.originalPersonId})</span>
                        <SemanticBadge type="confirmed" label="合并已确立" size="sm" />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">{b.mergedAt}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 bg-[#0e1118] p-2 rounded">
                      <div>保留原流水: <strong className="text-emerald-400 font-mono">{b.originalTipCount}</strong> 条</div>
                      <div>分支原打赏额: <strong className="text-emerald-400 font-mono">¥{b.originalTipAmount}</strong></div>
                      <div className="col-span-2">凭证编码: <span className="font-mono text-zinc-400">{b.evidenceRef}</span></div>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      合并原因: {b.mergeReason}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-400 italic pl-2">
                  无历史合并分支（此人物为单一档案构建）。
                </div>
              )}
            </div>
          </div>

          {/* Operational Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              运营特别备注
            </h4>
            <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] text-xs text-zinc-300 leading-relaxed">
              {person.notes || '暂无补充备注。'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: 数据证据 (Evidence & Locks) */}
      {activeTab === 'evidence' && (
        <div className="space-y-5">
          <div className="p-3 rounded-lg bg-[#12151d] border border-[#1f2532] text-xs text-zinc-300">
            <span className="font-semibold text-cyan-400">数据证据与字段锁溯源</span>
            <p className="text-zinc-400 text-[11px] mt-0.5">
              记录为什么认为某 UID 属于此人物、为什么某字段被人工锁定，杜绝无据推测。
            </p>
          </div>

          {/* Locked Fields */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              人工锁定的字段 ({person.lockedFields.length})
            </h4>

            {person.lockedFields.length === 0 ? (
              <p className="text-xs text-zinc-400 italic p-3 rounded bg-[#12151d] border border-[#1f2532]">
                当前未设置字段锁（允许常规规则自动更新）。
              </p>
            ) : (
              <div className="space-y-2">
                {person.lockedFields.map((f, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#141822] border border-cyan-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-cyan-300">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{f.label} ({f.field})</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">锁定于: {f.lockedAt}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px]">锁定原因: {f.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Identity Links & Evidence */}
          <div className="space-y-2 pt-3 border-t border-[#1f2532]">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              UID 身份关系与排除凭证 ({personLinks.length})
            </h4>

            {personLinks.length === 0 ? (
              <p className="text-xs text-zinc-400 italic p-3 rounded bg-[#12151d] border border-[#1f2532]">
                暂无独立身份核验凭证记录。
              </p>
            ) : (
              <div className="space-y-2">
                {personLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                      link.status === 'confirmed'
                        ? 'bg-[#131a20] border-emerald-500/30'
                        : link.status === 'rejected'
                        ? 'bg-[#201318] border-rose-500/30'
                        : 'bg-[#1e1c15] border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{link.uid}</span>
                        <SemanticBadge type={link.status} size="sm" />
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">{link.createdAt}</span>
                    </div>
                    <p className="text-zinc-300 text-[11px]">
                      <strong>证据支撑:</strong> {link.evidence}
                    </p>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-3">
                      <span>数据来源: {link.source}</span>
                      {link.confidence !== undefined && (
                        <span>置信度: {(link.confidence * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};
