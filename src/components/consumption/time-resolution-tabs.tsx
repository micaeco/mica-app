"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Resolution } from "@/types";

type Props = {
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  children: React.ReactNode;
};

export default function TimeResolutionTabs({
  resolution,
  setResolution,
  children,
}: Props) {
  const handleValueChange = (value: string) => {
    setResolution(value as Resolution);
  };

  return (
    <Tabs
      defaultValue={resolution}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList className="w-full justify-around">
        <TabsTrigger value="month" className="w-full font-semibold">
          Mes
        </TabsTrigger>
        <TabsTrigger value="week" className="w-full font-semibold">
          Setmana
        </TabsTrigger>
        <TabsTrigger value="day" className="w-full font-semibold">
          Dia
        </TabsTrigger>
      </TabsList>
      <TabsContent value={resolution}>{children}</TabsContent>
    </Tabs>
  );
}
