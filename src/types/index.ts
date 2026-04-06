// 宝宝护理记录类型定义

// ========== 喂奶记录 ==========
export type FeedingType = "breast_direct" | "breast_bottle" | "formula" | "mixed";

export interface FeedingRecord {
  id: string;
  timestamp: number;
  type: FeedingType;
  duration?: number; // 分钟，母乳亲喂用
  amount?: number; // ml，瓶喂/奶粉用
  notes: string;
}

// ========== 尿尿记录 ==========
export type DiaperType = "diaper" | "cloth" | "pull_up";

export interface PeeRecord {
  id: string;
  timestamp: number;
  diaperType: DiaperType;
  notes: string;
}

// ========== 便便记录 ==========
export type PoopColor = "yellow" | "green" | "brown" | "black" | "other";
export type PoopConsistency = "liquid" | "soft" | "formed" | "hard";

export interface PoopRecord {
  id: string;
  timestamp: number;
  color: PoopColor;
  consistency: PoopConsistency;
  notes: string;
}

// ========== AD记录 ==========
export interface ADRecord {
  id: string;
  timestamp: number;
  taken: boolean;
  notes: string;
}

// ========== Store 状态类型 ==========
export interface CareState {
  feedingRecords: FeedingRecord[];
  peeRecords: PeeRecord[];
  poopRecords: PoopRecord[];
  adRecords: ADRecord[];
}