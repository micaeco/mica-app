"use client";

import { set, eachDayOfInterval, format, addDays, subDays } from "date-fns";
import { useLocale } from "next-intl";

import { WheelPicker, WheelPickerItem } from "@app/_components/ui/wheel-picker";
import { getDateFnsLocale } from "@app/_i18n/routing";

export function DateTimePicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const dateValue = value ?? new Date();

  const handleDayChange = (isoString: string) => {
    const newDay = new Date(isoString);
    const newDate = set(newDay, {
      hours: dateValue.getHours(),
      minutes: dateValue.getMinutes(),
      seconds: dateValue.getSeconds(),
    });
    onChange(newDate);
  };

  const handleTimeChange = (timePart: { hours?: number; minutes?: number; seconds?: number }) => {
    const newDate = set(dateValue, timePart);
    onChange(newDate);
  };

  const locale = useLocale();

  const dateData = () => {
    const now = new Date();
    const interval = {
      start: subDays(now, 3),
      end: addDays(now, 3),
    };
    const days = eachDayOfInterval(interval);

    return days.map((date) => format(date, "EEE, d MMM yy", { locale: getDateFnsLocale(locale) }));
  };

  const hoursData = generatePaddedArray(24);
  const minutesData = generatePaddedArray(60);
  const secondsData = generatePaddedArray(60);

  return (
    <WheelPicker>
      <WheelPickerItem
        className="flex-[2]"
        data={dateData()}
        value={format(dateValue, "EEE, d MMM yy", { locale: getDateFnsLocale(locale) })}
        onChange={handleDayChange}
        perspective="center"
      />
      <WheelPickerItem
        className="flex-1"
        value={String(dateValue.getHours()).padStart(2, "0")}
        onChange={(val: string) => handleTimeChange({ hours: parseInt(val, 10) })}
        data={hoursData}
        perspective="center"
        loop
      />
      <WheelPickerItem
        className="flex-1"
        value={String(dateValue.getMinutes()).padStart(2, "0")}
        onChange={(val: string) => handleTimeChange({ minutes: parseInt(val, 10) })}
        data={minutesData}
        perspective="center"
        loop
      />
      <WheelPickerItem
        className="flex-1"
        value={String(dateValue.getSeconds()).padStart(2, "0")}
        onChange={(val: string) => handleTimeChange({ seconds: parseInt(val, 10) })}
        data={secondsData}
        perspective="center"
        loop
      />
    </WheelPicker>
  );
}

const generatePaddedArray = (length: number): string[] => {
  return Array.from({ length }, (_, i) => String(i).padStart(2, "0"));
};
