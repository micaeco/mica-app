import { Category, Device } from '@/types';

export const months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];

export const categories: Category[] = [
  { name: "all", icon: "/icons/all.webp", color: "--chart-6" },
  { name: "shower", icon: "/icons/shower.webp", color: "--chart-1" },
  { name: "washer", icon: "/icons/washing-machine.webp", color: "--chart-2" },
  { name: "toilet", icon: "/icons/toilet.webp", color: "--chart-3" },
  { name: "sink", icon: "/icons/sink.webp", color: "--chart-4" },
  { name: "dishwasher", icon: "/icons/dishwasher.webp", color: "--chart-5" },
];

export const devices: Device[] = [
  { name: "Dutxa habitació 2", category: categories.find(c => c.name === "shower") as Category },
  { name: "Rentadora", category: categories.find(c => c.name === "washer") as Category },
  { name: "Lavabo habitació 2", category: categories.find(c => c.name === "toilet") as Category },
  { name: "Dutxa habitació 1", category: categories.find(c => c.name === "shower") as Category },
  { name: "Lavabo habitació 1", category: categories.find(c => c.name === "toilet") as Category },
  { name: "Aixeta cuina", category: categories.find(c => c.name === "sink") as Category },
  { name: "Aixeta bany", category: categories.find(c => c.name === "sink") as Category },
  { name: "Rentaplats", category: categories.find(c => c.name === "dishwasher") as Category },
];