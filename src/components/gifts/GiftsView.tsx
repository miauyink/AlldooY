import React, { useState } from 'react';
import {
  Gift as GiftIcon,
  Clock,
  History,
  AlertTriangle,
  Coins,
  ShieldAlert,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Gift, TipStream } from '../../types';
import { SemanticBadge } from '../common/SemanticBadge';
import { Drawer } from '../common/Drawer';

interface GiftsViewProps {
  gifts: Gift[];
  tips: TipStream[];
}

export const GiftsView: React.FC<GiftsViewProps> = ({ gifts, tips }) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenGift = (gift: Gift) => {
    setSelectedGift(gift);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f131a] p-4 rounded-xl border border-[#1f2532]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white tracking-wide">礼物与价格中心</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              共 {gifts.length} 种道具
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            管理道具当前价格与历史调价时间轴，保障财务结算凭证的不可逆性
          </p>
        </div>
      </div>

      {/* Critical Principle Warning Card */}
      <div className="p-4 rounded-xl bg-[#141824] border border-emerald-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-emerald-300 text-sm">
            核心财务原则：历史流水金额绝对禁止反算
          </span>
          <p className="text-zinc-300 leading-relaxed text-[11px]">
            当道具（如「历史礼物A」）价格从 66 调整到 88、再到 99 元时，
            系统严格锁死历史发生每笔流水的实际交易单价。任何新价格生效仅对未来场次起效，
            系统从根源上阻止了因物价波动导致的历史累计打赏额被篡改或反向重算。
          </p>
        </div>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {gifts.map((gift) => {
          const associatedTips = tips.filter((t) => t.giftName === gift.name);
          const hasPriceChanges = gift.priceHistory.length > 1;

          return (
            <div
              key={gift.id}
              onClick={() => handleOpenGift(gift)}
              className="p-4 rounded-xl bg-[#0d1016] border border-[#1f2532] hover:border-emerald-500/40 hover:bg-[#121620] transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-base">
                    🎁
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      {gift.name}
                    </h3>
                    <span className="font-mono text-[10px] text-zinc-400">{gift.id}</span>
                  </div>
                </div>

                <SemanticBadge
                  type={gift.status === 'active' ? 'active' : 'inactive'}
                  label={gift.status === 'active' ? '上架中' : '已归档'}
                  size="sm"
                />
              </div>

              {/* Price block */}
              <div className="p-2.5 rounded-lg bg-[#141822] border border-[#232938] flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 text-[10px] block">当前单价</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    ¥{gift.currentPrice}
                  </span>
                </div>
                {hasPriceChanges ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-medium">
                    <History className="w-3 h-3" />
                    {gift.priceHistory.length} 次调价
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400">基准恒价</span>
                )}
              </div>

              {/* Description */}
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed min-h-[32px]">
                {gift.description || '暂无描述信息'}
              </p>

              {/* Footer stats */}
              <div className="pt-2 border-t border-[#1a202c] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>使用次数: {gift.usageCount}</span>
                <span>当前样本流水: {associatedTips.length} 笔</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gift Detail Drawer */}
      {selectedGift && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width="max-w-xl"
          title={
            <div className="flex items-center gap-2">
              <GiftIcon className="w-4 h-4 text-emerald-400" />
              <span>{selectedGift.name} - 价格历史与使用明细</span>
            </div>
          }
          subtitle={
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-mono text-zinc-400">ID: {selectedGift.id}</span>
              <span>•</span>
              <SemanticBadge
                type={selectedGift.status === 'active' ? 'active' : 'inactive'}
                size="sm"
              />
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Price banner */}
            <div className="p-4 rounded-lg bg-[#141822] border border-[#232938] flex items-center justify-between">
              <div>
                <span className="text-zinc-400 text-[11px] block">当前挂牌单价</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ¥{selectedGift.currentPrice}
                </span>
              </div>
              <div className="text-right text-zinc-400 text-[11px]">
                <div>累计打赏使用: {selectedGift.usageCount} 次</div>
                <div>最近使用时间: {selectedGift.lastUsedAt}</div>
              </div>
            </div>

            {/* Price Timeline */}
            <div className="space-y-2 p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532]">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                历史价格阶梯变动记录
              </h4>

              <div className="relative pl-6 border-l border-[#262e3d] space-y-3 py-1 mt-2">
                {selectedGift.priceHistory.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-[#0d1016]" />
                    <div className="p-2.5 rounded bg-[#161a24] border border-[#232a38] text-xs flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-white flex items-center gap-2">
                          <span className="text-amber-300">¥{item.price}</span>
                          {idx === selectedGift.priceHistory.length - 1 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                              现行价
                            </span>
                          )}
                        </div>
                        {item.note && (
                          <span className="text-zinc-400 text-[11px] block mt-0.5">
                            {item.note}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aliases & Mappings */}
            {selectedGift.aliases && (
              <div className="p-3.5 rounded-lg bg-[#12151d] border border-[#1f2532] space-y-1.5">
                <span className="text-zinc-400 text-[11px] block">导入别名映射 (Aliases)</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGift.aliases.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
};
