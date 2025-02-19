import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { ca } from "date-fns/locale/ca";
import { DateRange } from "react-day-picker";

import { Button } from "@components/ui/button";
import { Panel, PanelContent, PanelTrigger, PanelFooter } from "@components/ui/panel";
import { Calendar } from "@components/ui/calendar";
import { Resolution, TimeWindow } from "@/lib/types";
import { Locale } from "date-fns";

const localeMap: { [key: string]: Locale } = {
  en: enUS,
  es: es,
  ca: ca,
};

type Props = {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
  setResolution: (resolution: Resolution) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function DateRangePanel({ timeWindow, setTimeWindow, setResolution, open, setOpen }: Props) {
  const localeString = useLocale();
  const locale = localeMap[localeString] || enUS;
  const common = useTranslations("common");

  const [tempRange, setTempRange] = useState<DateRange | undefined>({
    from: timeWindow.startDate,
    to: timeWindow.endDate,
  });

  useEffect(() => {
    if (timeWindow.startDate && timeWindow.endDate) {
      setTempRange({
        from: timeWindow.startDate,
        to: timeWindow.endDate,
      });
    }
  }, [timeWindow]);

  const handleSelect = (range: DateRange | undefined) => {
    setTempRange(range);
  };

  const handleSubmit = () => {
    if (tempRange?.from && tempRange?.to) {
      setTimeWindow({
        startDate: tempRange.from,
        endDate: tempRange.to,
      });
      setResolution("personalized");
      setOpen(false);
    }
  };

  return (
    <Panel open={open} onOpenChange={setOpen}>
      <PanelTrigger asChild>
        <Button variant="outline">
          {new Date(timeWindow.startDate)?.toLocaleDateString()} -{" "}
          {new Date(timeWindow.endDate)?.toLocaleDateString()}
        </Button>
      </PanelTrigger>
      <PanelContent>
        <div className="space-y- flex flex-col items-center">
          <Calendar
            initialFocus
            mode="range"
            disabled={(date) => date > new Date()}
            defaultMonth={timeWindow?.startDate}
            selected={tempRange}
            onSelect={handleSelect}
            locale={locale}
          />
        </div>
        <PanelFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {common("cancel")}
          </Button>
          <Button onClick={handleSubmit}>{common("save")}</Button>
        </PanelFooter>
      </PanelContent>
    </Panel>
  );
}
