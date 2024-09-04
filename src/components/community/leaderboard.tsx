"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Droplet, Star } from "lucide-react";

const LeaderboardContent = ({ scope }: { scope: string }) => {
  const data: {
    [key: string]: {
      rank: number;
      name: string;
      points: number;
      water: number;
    }[];
  } = {
    district: [
      { rank: 1, name: "Family Escobar", points: 456, water: 40 },
      { rank: 2, name: "Joan", points: 367, water: 34 },
      { rank: 3, name: "Pis 4t 2a", points: 357, water: 16 },
      { rank: 4, name: "Miki & Co", points: 143, water: 6 },
      { rank: 5, name: "NoName", points: 96, water: 4 },
      { rank: 6, name: "Joan", points: 34, water: 4 },
      { rank: 7, name: "TBC", points: 12, water: 3 },
      { rank: 8, name: "TBC", points: 9, water: 1 },
    ],
    city: [
      { rank: 1, name: "Amigo Doner kebab", points: 789, water: 80 },
      { rank: 2, name: "Ajuntament de Barcelona", points: 654, water: 70 },
    ],
    country: [
      { rank: 1, name: "Keroro", points: 1234, water: 150 },
      { rank: 2, name: "Ricardo", points: 567, water: 50 },
    ],
    world: [
      { rank: 1, name: "John Doe", points: 9999, water: 1000 },
      { rank: 2, name: "Puigdemont", points: 8888, water: 900 },
    ],
  };

  return (
    <div className="space-y-2">
      {data[scope].map((item) => (
        <div key={item.rank} className="flex items-center space-x-3">
          <div className="w-6 text-center font-medium">{item.rank}</div>
          <div className="bg-brand-accent rounded-full p-2">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{item.name}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">{item.points} pt</div>
            <div className="text-sm flex items-center justify-end">
              <Droplet
                size={15}
                className="text-brand-secondary mr-1"
                fill={`hsl(var(--brand-secondary))`}
              />
              {item.water} L
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Leaderboard() {
  const [scope, setScope] = useState("district");

  return (
    <Tabs defaultValue="league">
      <TabsList>
        <TabsTrigger value="stats" disabled className="px-4 py-2">
          Estadístiques
        </TabsTrigger>
        <TabsTrigger value="league" className="px-4 py-2">
          Lliga
        </TabsTrigger>
      </TabsList>
      <TabsContent value="league">
        <Card className="space-y-2 p-4">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="district">Barri</SelectItem>
                <SelectItem value="city">Ciutat</SelectItem>
                <SelectItem value="country">País</SelectItem>
                <SelectItem value="world">Món</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <LeaderboardContent scope={scope} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
