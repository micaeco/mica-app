"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Resolution } from "@/lib/types";

type Props = {
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
};

export default function TimeResolutionDropdown({
  resolution,
  setResolution,
}: Props) {
  const common = useTranslations("common");

  return (
    <Select
      value={resolution}
      onValueChange={(value) => setResolution(value as Resolution)}
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
