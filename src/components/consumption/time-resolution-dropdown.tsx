import React, { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Resolution, TimeWindow } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import DateRangeCalendar from "./date-range-calendar";

type Props = {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
};

export default function TimeResolutionDropdown({
  timeWindow,
  setTimeWindow,
  resolution,
  setResolution,
}: Props) {
  const common = useTranslations("common");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleValueChange = (value: string) => {
    setResolution(value as Resolution);
    if (value === "personalized") {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Select defaultValue={resolution} onValueChange={handleValueChange}>
        <SelectTrigger className="max-w-36">
          <SelectValue placeholder="Select time resolution" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">
            <div className="first-letter:uppercase">{common("month")}</div>
          </SelectItem>
          <SelectItem value="week">
            <div className="first-letter:uppercase">{common("week")}</div>
          </SelectItem>
          <SelectItem value="day">
            <div className="first-letter:uppercase">{common("day")}</div>
          </SelectItem>
          <SelectItem value="personalized">
            <div className="first-letter:uppercase">
              {common("personalized")}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="justify-center max-w-96">
          <DateRangeCalendar
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
