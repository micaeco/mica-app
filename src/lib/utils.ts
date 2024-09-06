import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

import { Event, Category, Device, Resolution, TimeWindow } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConsumption(events: Event[], timeWindow: TimeWindow, category?: Category, device?: Device) {
  const startDate = timeWindow.startDate;
  const endDate = timeWindow.endDate;
  let consumption: number = 0;
  for (let j = 0; j < events.length; j++) {
    const event = events[j];
    let validConsumption = true;
    if (event.timestamp < startDate || event.timestamp >= endDate) {
      validConsumption = false;
    }
    if (category && event.category !== category) {
      validConsumption = false;
    }
    if (device && event.device.name !== device.name) {
      validConsumption = false;
    }

    if (validConsumption) {
      consumption += event.consumption;
    }
  }

  return consumption;
}

export default function getHistoricConsumption(events: Event[]) {
  let consumption = 0;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    consumption += event.consumption;
  }
  return consumption;
}

export function getDevices(events: Event[], timeWindow: TimeWindow, category?: Category) {
  const devicesRecord: Record<string, any> = {};
  let maxConsumption = 0;

  events.forEach(event => {
    if (event.timestamp >= timeWindow.startDate && event.timestamp < timeWindow.endDate && (!category || event.category.name === category.name)) {
      if (!devicesRecord[event.device.name]) {
        devicesRecord[event.device.name] = {
          consumption: event.consumption,
          uses: 1,
          category: event.category
        };
      } else {
        devicesRecord[event.device.name].consumption += event.consumption;
        devicesRecord[event.device.name].uses += 1;
      }
      maxConsumption = Math.max(maxConsumption, devicesRecord[event.device.name].consumption);
    }
  });

  const devices = Object.entries(devicesRecord)
    .map(([name, data]) => ({
      name,
      ...data
    }))
    .sort((a, b) => b.consumption - a.consumption);

  return { devices, maxConsumption };
}

export function getCategories(events: Event[], timeWindow: TimeWindow) {
  const categoriesRecord: Record<string, any> = {};
  let totalConsumption = 0;

  events.forEach(event => {
    if (event.timestamp >= timeWindow.startDate && event.timestamp < timeWindow.endDate) {
      if (!categoriesRecord[event.category.name]) {
        categoriesRecord[event.category.name] = {
          consumption: event.consumption,
          icon: event.category.icon,
          color: event.category.color
        };
      } else {
        categoriesRecord[event.category.name].consumption += event.consumption;
      }
      totalConsumption += event.consumption;
    }
  });

  const categories = Object.entries(categoriesRecord)
    .map(([name, data]) => ({
      name,
      ...data
    }))
    .sort((a, b) => b.consumption - a.consumption);

  return categories;
}

export const getDateRangeString = (start: Date, end: Date, resolution: Resolution, months: Record<string, string>) => {
  const numbersToMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  return resolution === "day" ?
    `${start.getDate().toString()} ${months[numbersToMonths[start.getMonth()]].slice(0, 3)}` : resolution === "week" ?
      `${start.getDate().toString()}-${end.getDate().toString()}` : `${months[numbersToMonths[start.getMonth()]].slice(0, 3)}`;;
};

export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) {
    return 'Invalid date';
  }
  return format(date, "d MMM yyyy HH:mm:ss", { locale: ca });
};
