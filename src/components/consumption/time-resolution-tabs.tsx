import React from "react";
import { useTranslations } from "next-intl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Resolution } from "@/lib/types";

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
  const common = useTranslations("common");

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
          <div className="first-letter:uppercase">{common("month")}</div>
        </TabsTrigger>
        <TabsTrigger value="week" className="w-full font-semibold ">
          <div className="first-letter:uppercase">{common("week")}</div>
        </TabsTrigger>
        <TabsTrigger value="day" className="w-full font-semibold">
          <div className="first-letter:uppercase">{common("day")}</div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={resolution}>{children}</TabsContent>
    </Tabs>
  );
}
