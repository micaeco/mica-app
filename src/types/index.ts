export interface TimeWindow {
  startDate: Date;
  endDate: Date;
  consumption?: number;
}

export interface Event {
  id: string;
  timestamp: Date;
  device: Device;
  category: Category;
  duration: number;
  consumption: number;
}

export interface Device {
  name: string;
  category: Category;
  consumption?: number;
  uses?: number;
}

export interface Category {
  name: 'all' | 'shower' | 'washer' | 'toilet' | 'garden' | 'pool' | 'sink' | 'dishwasher' | 'bathtub' | 'bidet' | 'other';
  color: string;
  icon: string;
  consumption?: number;
  uses?: number;
}

export type Resolution = 'day' | 'week' | 'month';

export type SortField = "date" | "hour" | "consumption" | "duration";

export type SortDirection = "asc" | "desc";