import React, { useState, useMemo } from 'react';
import {
  Coins,
  Filter,
  Search,
  Clock,
  HelpCircle,
  FileCheck2,
  Calendar,
  Layers,
  Radio,
  ExternalLink,
  ShieldCheck,
  Ban,
  Info,
} from 'lucide-react';
import { TipStream, Person } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';
import { Drawer } from '../common/Drawer';

interface TipsViewProps {
  tips: TipStream[];
  people: Person[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPersonById?: (id: string) => void;
}

export const TipsView: React.FC<TipsViewProps> = ({
  tips,
  people,
  searchQuery,
  onSearchChange,
  onSelectPersonById,
}) => {
  const [selectedTip, setSelectedTip] = useState<TipStream | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [filterSession, setFilterSession] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [filterAnonymous, setFilterAnonymous] = useState<string>('ALL');
  const [filterTimeType, setFilterTimeType] = useState<'event' | 'settlement' | 'entry'>('event');

  const filteredTips = useMemo(() => {
    return tips.filter((tip) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = tip.id.toLowerCase().includes(q);
        const matchPerson = tip.personCurrentName.toLowerCase().includes(q);
        const matchSnapshot = tip.senderSnapshotName.toLowerCase().includes(q);
        const matchGift = tip.giftName.toLowerCase().includes(q);
        const matchSession = tip.sessionId.toLowerCase().includes(q);
        if (!matchId && !matchPerson && !matchSnapshot && !matchGift && !matchSession) {
          return false;
        }
      }

      // Session
      if (filterSession !== 'ALL' && tip.sessionId !== filterSession) return false;

      // Source
      if (filterSource !== 'ALL' && tip.source !== filterSource) return false;

      // Anonymous
      if (filterAnonymous === 'anon' && !tip.isAnonymous) return false;
      if (filterAnonymous === 'real' && tip.isAnonymous) return false;

      return true;
    });
  }, [tips, searchQuery, filterSession, filterSource, filterAnonymous]);

  // Aggregate statistics
  const totalAmount = useMemo(() => {
    return filteredTips.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [filteredTips]);

  const handleOpenTip = (tip: TipStream) => {
    setSelectedTip(tip);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Core Rule Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">打赏流水工作台</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              共 {tips.length} 笔流水
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            严格区分「事件时间、结算日、录入时间」三种时间维度，杜绝单时间模糊统计
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 block">当前筛选结算总额</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              ¥{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Semantic principle alert */}
      <div className="p-3 rounded-lg bg-[#121620] border border-[#232c3d] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-zinc-300 space-y-0.5">
          <span className="font-semibold text-emerald-300">防反算与匿名保护规则</span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            1. 历史流水金额严格按当时交易快照保存，即使后续礼物单价调整，亦禁止反向重新计算；
            2. 匿名事件（如 TIP-0003）绝不建立永久 UID 与人物关系，杜绝隐私数据污染。
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-3.5 rounded-xl bg-[#0f131a] border border-[#1f2532] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {/* Session filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">关联场次</span>
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              aria-label="关联场次筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部场次</option>
              <option value="S-30012">S-30012 (今日完整场次)</option>
              <option value="S-20007">S-20007 (部分记录场次)</option>
              <option value="S-10001">S-10001 (早期历史场次)</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">导入来源渠道</span>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              aria-label="导入来源渠道筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部渠道</option>
              <option value="live_csv">live_csv (CSV批量导入)</option>
              <option value="manual">manual (手工单笔录入)</option>
              <option value="api_sync">api_sync (API实时同步)</option>
            </select>
          </div>

          {/* Anonymous filter */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">事件隐私属性</span>
            <select
              value={filterAnonymous}
              onChange={(e) => setFilterAnonymous(e.target.value)}
              aria-label="事件隐私属性筛选"
              className="w-full bg-[#151922] border border-[#232938] rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500/40 text-xs"
            >
              <option value="ALL">全部属性</option>
              <option value="anon">仅匿名事件</option>
              <option value="real">常规实名事件</option>
            </select>
          </div>

          {/* Time perspective switch */}
          <div className="space-y-1">
            <span className="text-zinc-400 text-[11px] block">表格优先显示时间</span>
            <div className="flex rounded-lg bg-[#141822] p-0.5 border border-[#232938]">
              <button
                onClick={() => setFilterTimeType('event')}
                className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterTimeType === 'event'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                事件时间
              </button>
              <button
                onClick={() => setFilterTimeType('settlement')}
                className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterTimeType === 'settlement'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                结算日
              </button>
              <button
                onClick={() => setFilterTimeType('entry')}
                className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterTimeType === 'entry'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                录入时间
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tipping Streams Table */}
      <div className="rounded-xl border border-[#1f2532] bg-[#0d1016] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#121620] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold border-b border-[#1f2532]">
              <tr>
                <th className="py-3 px-4">流水号</th>
                <th className="py-3 px-3">当时快照昵称 / 当前人物</th>
                <th className="py-3 px-3">礼物道具</th>
                <th className="py-3 px-3">数量</th>
                <th className="py-3 px-4 text-right">总额 (当时快照)</th>
                <th className="py-3 px-3">
                  {filterTimeType === 'event'
                    ? '事件时间'
                    : filterTimeType === 'settlement'
                    ? '结算日'
                    : '录入时间'}
                </th>
                <th className="py-3 px-3">场次 / 主播</th>
                <th className="py-3 px-3">渠道来源</th>
                <th className="py-3 px-3">状态属性</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d28] text-zinc-300">
              {filteredTips.map((tip) => {
                const isSnapshotDiff = tip.senderSnapshotName !== tip.personCurrentName;
                return (
                  <tr
                    key={tip.id}
                    onClick={() => handleOpenTip(tip)}
                    className="hover:bg-[#141923] cursor-pointer transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                      {tip.id}
                    </td>

                    {/* Snapshot name vs current name */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {tip.senderSnapshotName}
                        </span>
                        {isSnapshotDiff && (
                          <div className="text-[10px] text-amber-400/90 flex items-center gap-1 mt-0.5">
                            <span>主档案: {tip.personCurrentName}</span>
                            <span className="px-1 rounded bg-amber-500/10 text-[9px]">改名快照</span>
                          </div>
                        )}
                        {!isSnapshotDiff && (
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            {tip.personId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Gift */}
                    <td className="py-3 px-3">
                      <span className="text-zinc-200 font-medium">{tip.giftName}</span>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        单价快照 ¥{tip.unitPriceAtEvent}
                      </span>
                    </td>

                    {/* Qty */}
                    <td className="py-3 px-3 font-mono font-medium text-zinc-300">
                      × {tip.quantity}
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 text-right font-mono">
                      <span className="font-bold text-emerald-400 text-xs">
                        ¥{tip.totalAmount}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                      {filterTimeType === 'event' && tip.eventTime}
                      {filterTimeType === 'settlement' && tip.settlementDate}
                      {filterTimeType === 'entry' && tip.entryTime}
                    </td>

                    {/* Session & Streamer */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="text-zinc-300 block">{tip.sessionId}</span>
                      <span className="text-zinc-400 text-[10px]">{tip.streamerAccount}</span>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        {tip.source}
                      </span>
                    </td>

                    {/* Status / Anonymous */}
                    <td className="py-3 px-3">
                      {tip.isAnonymous ? (
                        <SemanticBadge type="anonymous" size="sm" />
                      ) : (
                        <SemanticBadge type="confirmed" label="正常入账" size="sm" />
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTip(tip);
                        }}
                        className="px-2.5 py-1 rounded text-[11px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        凭证抽屉
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTips.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <Coins className="w-8 h-8 text-zinc-400 mx-auto" />
            <div className="text-sm font-medium text-zinc-300">没有找到符合条件的打赏流水</div>
            <p className="text-xs text-zinc-400">请调整筛选或搜索条件</p>
          </div>
        )}
      </div>

      {/* Tip Detail Drawer */}
      {selectedTip && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width="max-w-xl"
          title={
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>流水详情与原始凭证: {selectedTip.id}</span>
            </div>
          }
          subtitle={
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-zinc-400">场次: {selectedTip.sessionId}</span>
              <span>•</span>
              <span className="font-mono text-zinc-400">主播: {selectedTip.streamerAccount}</span>
              {selectedTip.isAnonymous && <SemanticBadge type="anonymous" size="sm" />}
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Amount Banner */}
            <div className="p-4 rounded-lg bg-[#141924] border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-zinc-400 text-[11px] block">结算总金额</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ¥{selectedTip.totalAmount}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  ({selectedTip.giftName} × {selectedTip.quantity}，历史结算单价 ¥
                  {selectedTip.unitPriceAtEvent})
                </span>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                <SemanticBadge type="confirmed" label="金额已固化" size="sm" />
                <span className="block mt-1">不可反向重算</span>
              </div>
            </div>

            {/* Three distinct times comparison */}
            <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-2">
              <h4 className="text-zinc-300 font-semibold flex items-center gap-1.5 uppercase text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                三种时间维度严格比对
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block text-[10px]">1. 事件发生时间</span>
                  <span className="font-mono text-white text-[11px]">{selectedTip.eventTime}</span>
                </div>
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block text-[10px]">2. 业务结算日</span>
                  <span className="font-mono text-white text-[11px]">{selectedTip.settlementDate}</span>
                </div>
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block text-[10px]">3. 系统录入时间</span>
                  <span className="font-mono text-white text-[11px]">{selectedTip.entryTime}</span>
                </div>
              </div>
            </div>

            {/* Person & Snapshot comparison */}
            <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-2">
              <h4 className="text-zinc-300 font-semibold uppercase text-[11px]">
                打赏人物与历史快照
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block text-[10px]">打赏当时快照昵称</span>
                  <span className="font-bold text-white">{selectedTip.senderSnapshotName}</span>
                </div>
                <div className="p-2 rounded bg-[#161a24] border border-[#232a38]">
                  <span className="text-zinc-400 block text-[10px]">当前主人物档案</span>
                  <span className="font-medium text-emerald-300">
                    {selectedTip.personCurrentName} ({selectedTip.personId})
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Source & Anonymous Details */}
            <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-2">
              <h4 className="text-zinc-300 font-semibold uppercase text-[11px]">
                数据来源与凭证追溯
              </h4>
              <div className="space-y-1.5 text-[11px] text-zinc-300">
                <div className="flex justify-between py-1 border-b border-[#1b202a]">
                  <span className="text-zinc-400">导入源渠道:</span>
                  <span className="font-mono">{selectedTip.source}</span>
                </div>
                {selectedTip.sourceUid && (
                  <div className="flex justify-between py-1 border-b border-[#1b202a]">
                    <span className="text-zinc-400">来源 UID:</span>
                    <span className="font-mono">{selectedTip.sourceUid}</span>
                  </div>
                )}
                {selectedTip.importKey && (
                  <div className="flex justify-between py-1 border-b border-[#1b202a]">
                    <span className="text-zinc-400">入账回执 (importKey):</span>
                    <span className="font-mono text-emerald-400">{selectedTip.importKey}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-[#1b202a]">
                  <span className="text-zinc-400">匿名事件约束:</span>
                  <span>
                    {selectedTip.isAnonymous ? '是 (禁止建立永久UID关系)' : '否 (正常实名)'}
                  </span>
                </div>
                {selectedTip.tipReason && (
                  <div className="flex justify-between py-1 border-b border-[#1b202a]">
                    <span className="text-zinc-400">打赏特别原因:</span>
                    <span className="text-amber-300">{selectedTip.tipReason}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">人工确认审核:</span>
                  <span>{selectedTip.isManualConfirmed ? '已人工复核' : '自动规则入账'}</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
