import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, LocalizeFn, Month } from "date-fns";
import { ca, enUS, es, Locale } from "date-fns/locale";

import { Event, Category, Device, Resolution, TimeWindow } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getConsumption(
  events: Event[],
  timeWindow: TimeWindow,
  category?: Category,
  device?: Device
): number {
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

export function getHistoricConsumption(events: Event[]): number {
  let consumption = 0;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    consumption += event.consumption;
  }
  return consumption;
}

export function getAverageConsumption(events: Event[], resolution: Resolution = "day"): number {
  const consumptions: Record<string, number> = {};
  let totalPeriods = 0;

  for (const event of events) {
    let key: string;
    const date = event.timestamp;

    switch (resolution) {
      case "month":
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        break;
      case "week":
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
        break;
      case "day":
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        break;
    }

    if (!consumptions[key]) {
      consumptions[key] = 0;
      totalPeriods++;
    }
    consumptions[key] += event.consumption;
  }

  const totalConsumption = Object.values(consumptions).reduce((sum, value) => sum + value, 0);
  return totalPeriods > 0 ? totalConsumption / totalPeriods : 0;
}

export function getDevices(events: Event[], timeWindow: TimeWindow, category?: Category) {
  const devicesRecord: Record<string, { consumption: number; uses: number; category: Category }> =
    {};
  let maxConsumption = 0;

  events.forEach((event) => {
    if (
      event.timestamp >= timeWindow.startDate &&
      event.timestamp < timeWindow.endDate &&
      (!category || event.category.name === category.name)
    ) {
      if (!devicesRecord[event.device.name]) {
        devicesRecord[event.device.name] = {
          consumption: event.consumption,
          uses: 1,
          category: event.category,
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
      ...data,
    }))
    .sort((a, b) => b.consumption - a.consumption);

  return { devices, maxConsumption };
}

export function getCategories(events: Event[], timeWindow: TimeWindow) {
  const categoriesRecord: Record<string, Category> = {};

  events.forEach((event) => {
    if (event.timestamp >= timeWindow.startDate && event.timestamp < timeWindow.endDate) {
      if (!categoriesRecord[event.category.name]) {
        categoriesRecord[event.category.name] = {
          name: event.category.name,
          label: event.category.label,
          consumption: event.consumption,
          icon: event.category.icon,
          color: event.category.color,
        };
      } else {
        categoriesRecord[event.category.name].consumption += event.consumption;
      }
    }
  });

  const categories = Object.entries(categoriesRecord)
    .map(([, data]) => ({
      ...data,
    }))
    .sort((a, b) => b.consumption - a.consumption);

  return categories;
}

export function getDateFnsLocale(locale: string): Locale {
  const customCatalan: Locale = {
    ...ca,
    localize: {
      ...ca.localize,
      month: ((monthIndex: number, { width = "abbreviated" } = {}) => {
        const months = {
          narrow: ["G", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          abbreviated: [
            "gen",
            "feb",
            "mar",
            "abr",
            "mai",
            "jun",
            "jul",
            "ago",
            "set",
            "oct",
            "nov",
            "des",
          ],
          wide: [
            "gener",
            "febrer",
            "març",
            "abril",
            "maig",
            "juny",
            "juliol",
            "agost",
            "setembre",
            "octubre",
            "novembre",
            "desembre",
          ],
        };

        return months[width as keyof typeof months][monthIndex];
      }) as LocalizeFn<Month>,
    },
  };

  switch (locale) {
    case "en":
      return enUS;
    case "ca":
      return customCatalan;
    case "es":
      return es;
    default:
      return enUS;
  }
}

export function formatDate(date: Date, locale: string) {
  if (!(date instanceof Date)) {
    return "Invalid date";
  }
  return format(date, "d MMM yyyy HH:mm:ss", { locale: getDateFnsLocale(locale) });
}

export function formatDateRange(start: Date, end: Date, resolution: Resolution, locale: string) {
  const dateFnsLocale = getDateFnsLocale(locale);
  const formatOptions = { locale: dateFnsLocale };

  const formatPatterns = {
    day: "d MMM",
    week: "d-d",
    month: "MMM",
    personalized: "d-d MMM",
  };

  switch (resolution) {
    case "day":
      return format(start, formatPatterns.day, formatOptions);
    case "week":
      return `${format(start, "d", formatOptions)}-${format(end, "d", formatOptions)}`;
    case "personalized":
      return `${format(start, "d", formatOptions)}-${format(end, "d", formatOptions)} ${format(start, "MMM", formatOptions)}`;
    case "month":
      return format(start, formatPatterns.month, formatOptions);
  }
}
