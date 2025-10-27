import { ElementType } from "react";

import { cn } from "@app/_lib/utils";
import { Thresholds } from "@domain/entities/efficiency";

export function KPIGauge({
  value,
  unit,
  thresholds,
  label,
  icon: Icon,
}: {
  value: number;
  unit: string;
  thresholds: Thresholds;
  label: string;
  icon: ElementType;
}) {
  const ratio = segmentRatio(value, thresholds);
  const size = 80;
  const strokeWidth = 2;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const visibleLen = C * (300 / 360);
  const startDeg = 120;
  const dashOffsetBase = C * (1 - startDeg / 360);
  const progressLen = visibleLen * ratio;
  const [t1, t2] = thresholds;
  const progressColor =
    value <= t1
      ? "hsl(var(--brand-secondary))"
      : value <= t2
        ? "hsl(var(--brand-tertiary))"
        : "hsl(var(--brand-quaternary))";

  return (
    <div className="flex flex-col items-center space-y-2 pb-8">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${visibleLen} ${C - visibleLen}`}
            strokeDashoffset={dashOffsetBase}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            strokeDasharray={`${progressLen} ${C - progressLen}`}
            strokeDashoffset={dashOffsetBase}
          />
        </svg>

        <span
          className={cn(
            "absolute text-center text-sm font-bold select-none",
            unit.length > 1 ? "flex flex-col" : "flex gap-1"
          )}
        >
          <span>{value}</span>
          <span>{unit}</span>
        </span>

        <div className="absolute -bottom-10 flex flex-col items-center gap-2">
          <Icon className="font-bold" />
          <p className="text-muted-foreground min-h-[2lh] text-center text-[12px] leading-tight">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

const segmentRatio = (value: number, [t1, t2, t3]: Thresholds) => {
  let r = 0;
  if (value <= t1) r = value / Math.max(t1, 1e-9) / 3;
  else if (value <= t2) r = 1 / 3 + (value - t1) / Math.max(t2 - t1, 1e-9) / 3;
  else r = 2 / 3 + (value - t2) / Math.max(t3 - t2, 1e-9) / 3;
  return Math.min(Math.max(r, 0), 1);
};
