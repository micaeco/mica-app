"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Resolution } from "@/lib/types";

type Props = {
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  setOpen: (open: boolean) => void;
};

export function TimeResolutionSelect({ resolution, setResolution, setOpen }: Props) {
  const common = useTranslations("common");

  return (
    <Select
      value={resolution}
      onValueChange={(value) => {
        setResolution(value as Resolution);
        if (value === "personalized") {
          setOpen(true);
        }
      }}
    >
      <SelectTrigger className="max-w-36 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="capitalize">
        <SelectItem value="month">{common("month")}</SelectItem>
        <SelectItem value="week">{common("week")}</SelectItem>
        <SelectItem value="day">{common("day")}</SelectItem>
        <SelectItem value="personalized">{common("personalized")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
