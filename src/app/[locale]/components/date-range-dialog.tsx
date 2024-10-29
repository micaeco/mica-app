import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { ca } from "date-fns/locale/ca";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Resolution, TimeWindow } from "@/lib/types";

const localeMap: { [key: string]: any } = {
  en: enUS,
  es: es,
  ca: ca,
};

type Props = {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
  setResolution: (resolution: Resolution) => void;
};

export default function DateRangeDialog({
  timeWindow,
  setTimeWindow,
  setResolution,
}: Props) {
  const localeString = useLocale();
  const locale = localeMap[localeString] || enUS;

  const common = useTranslations("common");

  useEffect(() => {
    if (timeWindow.startDate && timeWindow.endDate) {
      setTempRange({
        from: timeWindow.startDate,
        to: timeWindow.endDate,
      });
    }
  }, [timeWindow]);

  const [tempRange, setTempRange] = useState<DateRange | undefined>({
    from: timeWindow.startDate,
    to: timeWindow.endDate,
  });

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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {new Date(timeWindow.startDate)?.toLocaleDateString()} -
          {new Date(timeWindow.endDate)?.toLocaleDateString()}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-96">
        <div className="flex flex-col items-center space-y-4">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={timeWindow?.startDate}
            selected={tempRange}
            onSelect={handleSelect}
            locale={locale}
          />
          <DialogFooter className="w-full flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">{common("cancel")}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSubmit}>{common("save")}</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
