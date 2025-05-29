import { cn } from "@app/_lib/utils";

export function ConsumptionBar({
  consumptionPercentage,
  color,
}: {
  consumptionPercentage: number;
  color?: string;
}) {
  return (
    <div className="bg-muted mt-1 h-2 w-full overflow-hidden rounded-full">
      <div
        className={cn("h-full rounded-full", {
          "bg-brand-secondary": !color,
          "bg-chart-1": color === "chart-1",
          "bg-chart-2": color === "chart-2",
          "bg-chart-3": color === "chart-3",
          "bg-chart-4": color === "chart-4",
          "bg-chart-5": color === "chart-5",
        })}
        style={{
          width: `${consumptionPercentage}%`,
        }}
        title={`${Math.round(consumptionPercentage)}% of total consumption`}
      />
    </div>
  );
}
