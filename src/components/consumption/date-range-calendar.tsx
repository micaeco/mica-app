import { Calendar } from "@/components/ui/calendar";
import { TimeWindow } from "@/lib/types";
import { useLocale } from "next-intl";
import { DateRange } from "react-day-picker";

import enUS from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import ca from "date-fns/locale/ca";

const localeMap: { [key: string]: any } = {
  en: enUS,
  es: es,
  ca: ca,
};

type Props = {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
};

export default function DateRangeCalendar({
  timeWindow,
  setTimeWindow,
}: Props) {
  const localeString = useLocale();

  const locale = localeMap[localeString] || enUS;

  const handleSelect = (range: DateRange | undefined) => {
    setTimeWindow({
      startDate: range?.from ?? timeWindow.startDate,
      endDate: range?.to ?? timeWindow.endDate,
    });
  };

  return (
    <Calendar
      initialFocus
      mode="range"
      defaultMonth={timeWindow?.startDate}
      selected={{
        from: timeWindow.startDate,
        to: timeWindow.endDate,
      }}
      onSelect={handleSelect}
      locale={locale}
    />
  );
}
