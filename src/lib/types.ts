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
  name: CategoryName;
  color: string;
  icon: string;
  label: string;
  consumption?: number;
  uses?: number;
}

export type CategoryName = 'all' | 'shower' | 'washer' | 'toilet' | 'sink' | 'dishwasher' | 'bathtub' | 'other'

export type Resolution = 'day' | 'week' | 'month' | 'personalized';

export type SortField = "date" | "hour" | "consumption" | "duration";

export type SortDirection = "asc" | "desc";