import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { ca } from "date-fns/locale/ca";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Resolution, TimeWindow } from "@/lib/types";
import { useMediaQuery } from "@/hooks/use-media-query";
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

export default function DateRangePicker({
  timeWindow,
  setTimeWindow,
  setResolution,
  open,
  setOpen,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
              disabled={(date) => date > new Date()}
              defaultMonth={timeWindow?.startDate}
              selected={tempRange}
              onSelect={handleSelect}
              locale={locale}
            />
          </div>
          <DialogFooter className="flex-row justify-around gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {common("cancel")}
            </Button>
            <Button onClick={handleSubmit}>{common("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {new Date(timeWindow.startDate)?.toLocaleDateString()} -
          {new Date(timeWindow.endDate)?.toLocaleDateString()}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4 pb-4">
          <div className="flex flex-col items-center space-y-4">
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
          <DrawerFooter className="flex-row justify-center gap-20 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {common("cancel")}
            </Button>
            <Button onClick={handleSubmit}>{common("save")}</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
