import { Event } from '@/types';
import { devices } from '@/constants';

export function generateEvents(days: number): Event[] {
  const data: Event[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    for (let j = 0; j < Math.floor(Math.random() * 10) + 5; j++) {
      const deviceIndex = Math.floor(Math.random() * devices.length);
      data.push({
        id: `${i}-${j}`,
        timestamp: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        device: devices[deviceIndex],
        category: devices[deviceIndex].category,
        duration: Math.floor(Math.random() * 600) + 30,
        consumption: Math.floor(Math.random() * 80) + 1,
      });
    }
  }

  return data;
};