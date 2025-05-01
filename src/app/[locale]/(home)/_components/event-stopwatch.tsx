"use client";

import { useTranslations } from "next-intl";
import { PauseIcon, PlayIcon, RefreshCwIcon } from "lucide-react";
import { useStopwatch } from "react-timer-hook";

import { Button } from "@components/ui/button";

export function EventStopwatch({
  setStartTime,
  setEndTime,
}: {
  setStartTime: (date: Date) => void;
  setEndTime: (date: Date) => void;
}) {
  const {
    totalMilliseconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({
    autoStart: false,
    interval: 20,
  });

  const tCommon = useTranslations("common");

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center">
        <div className="text-center font-mono text-3xl tracking-wider">
          <span>{String(hours).padStart(2, "0")}</span>:
          <span>{String(minutes).padStart(2, "0")}</span>:
          <span>{String(seconds).padStart(2, "0")}</span>.
          <span className="text-3xl">{String(milliseconds).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={() => {
            if (isRunning) {
              pause();
              setEndTime(new Date());
            } else if (totalMilliseconds > 0) {
              reset(new Date(), false);
            } else {
              start();
              setStartTime(new Date());
            }
          }}
          variant="outline"
          className="w-fit"
        >
          {isRunning ? (
            <>
              <PauseIcon className="mr-2 h-4 w-4" />
              {tCommon("pause")}
            </>
          ) : totalMilliseconds > 0 ? (
            <>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              {tCommon("reset")}
            </>
          ) : (
            <>
              <PlayIcon className="mr-2 h-4 w-4" />
              {tCommon("start")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
