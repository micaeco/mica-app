import { useTranslations } from "next-intl";

import { cn } from "@app/_lib/utils";
import { ConsumptionPerDayPerPersonBenchmark } from "@domain/entities/efficiency";

export function ComparisonChart({ benchmark }: { benchmark: ConsumptionPerDayPerPersonBenchmark }) {
  const t = useTranslations("efficiency.comparison");

  const maxValue = Math.max(benchmark.value, benchmark.average, benchmark.target);
  const rows = [
    { label: t("you"), value: benchmark.value, displayValue: `${benchmark.value} L`, isUser: true },
    {
      label: t("average"),
      value: benchmark.average,
      displayValue: `${benchmark.average > benchmark.value ? "+" : ""}${Math.round(((benchmark.average - benchmark.value) / benchmark.value) * 100)}%`,
      isUser: false,
    },
    {
      label: t("optimalUse"),
      value: benchmark.target,
      displayValue: `${benchmark.target > benchmark.value ? "+" : ""}${Math.round(((benchmark.target - benchmark.value) / benchmark.value) * 100)}%`,
      isUser: false,
    },
  ];
  const userPct = (benchmark.value / maxValue) * 100;
  const userOffset = `calc(${userPct}% - 5px)`;

  return (
    <div className="relative space-y-3">
      {rows.map((row, index) => {
        const pct = (row.value / maxValue) * 100;
        const leftOfUser = pct < userPct;

        return (
          <div key={row.label} className="relative">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-20 text-sm">{row.label}</span>
              <div className="relative h-2 flex-1 overflow-visible rounded-full">
                {index === 0 && (
                  <div
                    className="border-primary pointer-events-none absolute border-l-1 border-dotted"
                    style={{ left: userOffset, top: 0, bottom: `-3.9rem` }}
                  />
                )}
                <div
                  className="bg-brand-secondary absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
                {!row.isUser && (
                  <>
                    <div
                      className="bg-brand-primary absolute z-[1] h-1.5 w-1.5 rounded-full"
                      style={{ left: userOffset, top: "50%", transform: "translate(-50%, -50%)" }}
                    />
                    {pct !== userPct && (
                      <>
                        <div
                          className="bg-brand-primary absolute top-1/2 z-0 h-px -translate-y-1/2"
                          style={{
                            left: leftOfUser ? `${pct}%` : userOffset,
                            width: leftOfUser
                              ? `calc(${Math.abs(pct - userPct)}% - 5px)`
                              : `calc(${Math.abs(pct - userPct)}% + 5px)`,
                          }}
                        />
                        <div
                          className="absolute z-[1]"
                          style={{
                            left: `${pct}%`,
                            top: "50%",
                            transform: leftOfUser
                              ? "translate(-1px, -50%) scaleX(-1)"
                              : "translate(calc(-100% + 1px), -50%)",
                          }}
                        >
                          <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                            <path
                              d="M0 1 L5 4 L0 7"
                              stroke="hsl(var(--brand-primary))"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <span
                className={cn(
                  "w-16 text-right text-sm",
                  row.isUser && "text-brand-secondary font-bold"
                )}
              >
                {row.displayValue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
