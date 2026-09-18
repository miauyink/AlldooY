import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Lock,
  GitBranch,
  AlertCircle,
  ArrowUpDown,
  Coins,
  Database,
  ExternalLink,
  Ban,
  Sparkles,
  Info,
} from 'lucide-react';
import { Person, Account, TipStream, IdentityLink } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';
import { PersonDetailDrawer } from './PersonDetailDrawer';

interface PeopleViewProps {
  people: Person[];
  accounts: Account[];
  tips: TipStream[];
  identityLinks: IdentityLink[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  people,
  accounts,
  tips,
  identityLinks,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterTipRange, setFilterTipRange] = useState<string>('ALL');
  const [filterSpecial, setFilterSpecial] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'amount' | 'active' | 'accounts' | 'id'>('amount');
  const [sortDesc, setSortDesc] = useState(true);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [people]);

  // Filtered & sorted people
  const filteredPeople = useMemo(() => {
    return people
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.currentNickname.toLowerCase().includes(q);
          const matchId = p.id.toLowerCase().includes(q);
          const matchPet = p.petName?.toLowerCase().includes(q);
          const matchNickHist = p.nicknameHistory.some((nh) => nh.nickname.toLowerCase().includes(q));
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          const matchUid = p.uidList?.some((u) => u.toLowerCase().includes(q));
          if (!matchName && !matchId && !matchPet && !matchNickHist && !matchTag && !matchUid) {
            return false;
          }
        }

        // Tag filter
        if (filterTag !== 'ALL' && !p.tags.includes(filterTag)) {
          return false;
        }

        // Level filter
        if (filterLevel === 'not_collected' && p.currentLevel !== 'not_collected') return false;
        if (filterLevel === 'unknown' && p.currentLevel !== 'unknown') return false;
        if (filterLevel === 'high' && (typeof p.currentLevel !== 'number' || p.currentLevel < 4)) return false;

        // Tip range
        if (filterTipRange === '10k+' && p.totalTipAmount < 10000) return false;
        if (filterTipRange === '5k-10k' && (p.totalTipAmount < 5000 || p.totalTipAmount >= 10000)) return false;
        if (filterTipRange === 'sub-5k' && (p.totalTipAmount <= 0 || p.totalTipAmount >= 5000)) return false;
        if (filterTipRange === 'zero' && p.totalTipAmount !== 0) return false;

        // Special flags
        if (filterSpecial === 'multi_account' && p.accountCount <= 1) return false;
        if (filterSpecial === 'has_branch' && (!p.branches || p.branches.length === 0)) return false;
        if (filterSpecial === 'has_audit' && !p.hasPendingAudit) return false;
        if (filterSpecial === 'has_lock' && p.lockedFields.length === 0) return false;
        if (filterSpecial === 'forbid_chat' && !p.forbidPrivateChat) return false;

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'amount') diff = a.totalTipAmount - b.totalTipAmount;
        else if (sortBy === 'accounts') diff = a.accountCount - b.accountCount;
        else if (sortBy === 'active') diff = a.lastActive.localeCompare(b.lastActive);
        else if (sortBy === 'id') diff = a.id.localeCompare(b.id);
        return sortDesc ? -diff : diff;
      });
  }, [people, searchQuery, filterTag, filterLevel, filterTipRange, filterSpecial, sortBy, sortDesc]);

  const handleOpenPerson = (person: Person) => {
    setSelectedPerson(person);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* View Title & Quick Principles Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">人物档案中心</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              共 {people.length} 位人物
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            支持多账号关系演变、历史分支溯源、字段锁保护与缺失语义明确辨别
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFilterTag('ALL');
              setFilterLevel('ALL');
              setFilterTipRange('ALL');
              setFilterSpecial('ALL');
              onSearchChange('');
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#181d28] text-zinc-300 hover:text-white hover:bg-[#202736] border border-[#273042] transition-colors"
          >
            重置所有筛选
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-[#0f131a] border border-[#1f2532] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {/* Tag Filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">人物标签</span>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              aria-label="人物标签筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部标签</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">等级状态</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              aria-label="等级状态筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部等级</option>
              <option value="high">高等级 (Lv.4+)</option>
              <option value="not_collected">当时未采集 (非0)</option>
              <option value="unknown">当前未知</option>
            </select>
          </div>

          {/* Tip Range Filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">累计打赏额</span>
            <select
              value={filterTipRange}
              onChange={(e) => setFilterTipRange(e.target.value)}
              aria-label="累计打赏额筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部区间</option>
              <option value="10k+">万元以上 (≥ ¥10,000)</option>
              <option value="5k-10k">五千至万元 (¥5,000 - ¥10,000)</option>
              <option value="sub-5k">五千元以下 (&lt; ¥5,000)</option>
              <option value="zero">无打赏记录 (¥0 流水)</option>
            </select>
          </div>

          {/* Special Condition Filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">特殊业务标识</span>
            <select
              value={filterSpecial}
              onChange={(e) => setFilterSpecial(e.target.value)}
              aria-label="特殊业务标识筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部状态</option>
              <option value="multi_account">拥有多个账号 (主/小号)</option>
              <option value="has_branch">包含历史合并分支</option>
              <option value="has_audit">存在待审核冲突</option>
              <option value="has_lock">存在人工字段锁</option>
              <option value="forbid_chat">标记禁止私聊</option>
            </select>
          </div>
        </div>

        {/* Active Filters count indicator */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-[#1e232d]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              已筛选出 <strong className="text-emerald-400 font-mono">{filteredPeople.length}</strong> 位人物
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">排序方式:</span>
            <button
              onClick={() => {
                if (sortBy === 'amount') setSortDesc(!sortDesc);
                else {
                  setSortBy('amount');
                  setSortDesc(true);
                }
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                sortBy === 'amount'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              累计打赏
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                if (sortBy === 'active') setSortDesc(!sortDesc);
                else {
                  setSortBy('active');
                  setSortDesc(true);
                }
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                sortBy === 'active'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              最近活跃
            </button>

            <button
              onClick={() => {
                if (sortBy === 'accounts') setSortDesc(!sortDesc);
                else {
                  setSortBy('accounts');
                  setSortDesc(true);
                }
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                sortBy === 'accounts'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              账号数
            </button>
          </div>
        </div>
      </div>

      {/* Table of People */}
      <div className="rounded-xl border border-[#1f2532] bg-[#0d1016] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#121620] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#1f2532]">
              <tr>
                <th className="py-3 px-4">人物标识 / 当前昵称</th>
                <th className="py-3 px-3">人物ID</th>
                <th className="py-3 px-3">当前等级</th>
                <th className="py-3 px-3">标签与角色</th>
                <th className="py-3 px-3">账号数量</th>
                <th className="py-3 px-4 text-right">累计打赏</th>
                <th className="py-3 px-3">最近活跃</th>
                <th className="py-3 px-3">业务标记</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d28] text-zinc-300">
              {filteredPeople.map((person) => {
                const isHovered = false;
                const hasBranch = person.branches && person.branches.length > 0;
                return (
                  <tr
                    key={person.id}
                    onClick={() => handleOpenPerson(person)}
                    className="hover:bg-[#141923] cursor-pointer transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                          {person.currentNickname.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-white group-hover:text-emerald-300 transition-colors">
                            <span>{person.currentNickname}</span>
                            {person.petName && (
                              <span className="text-[10px] text-zinc-400">({person.petName})</span>
                            )}
                          </div>
                          {person.nicknameHistory.length > 1 && (
                            <span className="text-[10px] text-zinc-400 block truncate max-w-[140px]">
                              曾用: {person.nicknameHistory[0].nickname}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                      {person.id}
                    </td>

                    {/* Level */}
                    <td className="py-3 px-3">
                      {person.currentLevel === 'not_collected' ? (
                        <SemanticBadge type="not_collected" label="当时未采集" size="sm" />
                      ) : person.currentLevel === 'unknown' ? (
                        <SemanticBadge type="unknown" label="当前未知" size="sm" />
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Lv.{person.currentLevel}
                        </span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {person.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                          >
                            {t}
                          </span>
                        ))}
                        {person.tags.length > 2 && (
                          <span className="text-[10px] text-zinc-400">+{person.tags.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Accounts count */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-mono text-zinc-300">
                        <Database className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{person.accountCount}</span>
                        {person.accountCount > 1 && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1 rounded">
                            多号
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Tip */}
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="font-semibold text-emerald-400 text-xs">
                        ¥{person.totalTipAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-zinc-400">{person.tipCount} 笔流水</div>
                    </td>

                    {/* Last active */}
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                      {person.lastActive}
                    </td>

                    {/* Business status badges */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {hasBranch && (
                          <span
                            title="包含历史分支档案"
                            className="p-1 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {person.lockedFields.length > 0 && (
                          <span
                            title={`人工锁定: ${person.lockedFields.map((f) => f.label).join(', ')}`}
                            className="p-1 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {person.hasPendingAudit && (
                          <span
                            title="存在待审核事项"
                            className="p-1 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {person.forbidPrivateChat && (
                          <span
                            title="禁止私聊"
                            className="p-1 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPerson(person);
                        }}
                        className="px-2.5 py-1 rounded text-[11px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        详情抽屉
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPeople.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <Info className="w-8 h-8 text-zinc-400 mx-auto" />
            <div className="text-sm font-medium text-zinc-300">没有找到符合条件的人物</div>
            <p className="text-xs text-zinc-400">请尝试放宽筛选条件或清空搜索关键词</p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <PersonDetailDrawer
        person={selectedPerson}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        accounts={accounts}
        tips={tips}
        identityLinks={identityLinks}
      />
    </div>
  );
};
