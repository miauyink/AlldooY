/**
 * AlldooY - 人物与打赏运营中心
 * Core TypeScript Definitions
 */

export type SemanticValue<T> = T | 'not_collected' | 'unknown' | 'empty' | 'none';

export interface NicknameHistoryItem {
  date: string;
  nickname: string;
  reason?: string;
}

export interface LevelHistoryItem {
  date: string;
  level: number | 'not_collected' | 'unknown';
  note?: string;
}

export interface LockedFieldItem {
  field: string;
  label: string;
  reason: string;
  lockedAt: string;
}

export interface HistoricalBranch {
  originalPersonId: string;
  originalNickname: string;
  originalTipCount: number;
  originalTipAmount: number;
  mergedAt: string;
  mergeReason: string;
  status: 'confirmed';
  originalDataPreserved: boolean;
  evidenceRef: string;
  originalProfileBio?: string;
}

export interface Person {
  id: string; // P-0001
  currentNickname: string;
  nicknameHistory: NicknameHistoryItem[];
  currentLevel: number | 'not_collected' | 'unknown';
  levelHistory: LevelHistoryItem[];
  petName?: string; // 爱称
  title?: string; // 称号
  tags: string[];
  totalTipAmount: number;
  tipCount: number;
  accountCount: number;
  currentStatus: 'active' | 'archived' | 'merged';
  profileStatus: 'confirmed' | 'not_collected' | 'unknown' | 'no_record' | 'unconfirmed';
  profileUrl?: string | null;
  profileLocation?: string;
  profileBirthday?: string;
  profileJob?: string;
  profileBio?: string;
  forbidPrivateChat: boolean;
  lockedFields: LockedFieldItem[];
  firstSeen: string;
  lastActive: string;
  hasPendingAudit: boolean;
  pendingAuditReason?: string;
  branches?: HistoricalBranch[];
  songListCount?: number;
  notes?: string;
  uidList?: string[];
}

export interface Account {
  id: string; // A-001
  personId: string;
  personName: string;
  displayName: string;
  uid: string;
  douyinId: string;
  profileUrl: string | 'not_collected' | 'none';
  profileKey: string;
  role: 'main' | 'sub' | 'historical' | 'unknown';
  status: 'active' | 'inactive';
  confirmationStatus: 'confirmed' | 'pending' | 'rejected';
  firstConfirmedAt: string;
  lastConfirmedAt: string;
  dataSource: string;
  notes?: string;
}

export interface TipStream {
  id: string; // TIP-0001
  personId: string;
  personCurrentName: string;
  senderSnapshotName: string; // 当时快照昵称
  giftName: string;
  giftId: string;
  quantity: number;
  totalAmount: number;
  unitPriceAtEvent: number;
  eventTime: string; // 事件时间
  settlementDate: string; // 结算日
  entryTime: string; // 录入时间
  sessionId: string; // S-30012
  streamerAccount: string; // STREAMER-3
  source: 'manual' | 'live_csv' | 'api_sync';
  sourceUid?: string;
  isAnonymous: boolean; // 匿名事件 (不建立永久UID关系)
  isManualConfirmed: boolean;
  tipReason?: string; // 打赏原因
  importKey?: string;
}

export interface GiftPriceHistory {
  date: string;
  price: number;
  note?: string;
}

export interface Gift {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: GiftPriceHistory[];
  status: 'active' | 'inactive';
  usageCount: number;
  lastUsedAt: string;
  description?: string;
  aliases?: string[];
}

export interface LiveSession {
  id: string; // S-10001
  streamerAccount: string; // STREAMER-1
  startTime: string;
  endTime: string;
  dataIntegrity: 'time_only' | 'partial' | 'full';
  tipTotalAmount: number | 'not_collected';
  contributorCount: number | 'not_collected';
  commentsStatus: 'not_collected' | 'partial' | 'full';
  onlineAudienceStatus: 'not_collected' | 'partial' | 'full';
  reviewStatus: 'not_collected' | 'partial' | 'full';
  relationshipStatus: 'not_collected' | 'partial' | 'full';
  notes?: string;
}

export interface IdentityLink {
  id: string;
  uid: string;
  personId: string;
  personName: string;
  status: 'confirmed' | 'pending' | 'rejected';
  confidence?: number;
  evidence: string;
  source: string;
  createdAt: string;
}

export interface ImportReceipt {
  importKey: string;
  status: 'committed' | 'pending' | 'failed';
  source: string;
  tipId: string;
  timestamp: string;
  summary: string;
}

export interface ImportExclusion {
  importKey: string;
  status: 'excluded';
  reason: string;
  operator: string;
  rawEventSnapshot: string;
  timestamp: string;
  recoverable: boolean;
}

export interface AuditItem {
  id: string; // AUDIT-001
  type: 'identity_link' | 'duplicate_person' | 'unknown_gift' | 'import_exclusion' | 'conflict';
  title: string;
  currentEntity: string;
  candidateEntity?: string;
  problem: string;
  suggestion: string;
  evidence: string;
  confidence?: number;
  source: string;
  scope: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'postponed';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type NavTab = 'overview' | 'people' | 'tips' | 'gifts' | 'sessions' | 'audit' | 'evidence';
