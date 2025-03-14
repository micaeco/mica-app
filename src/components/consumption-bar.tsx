export function ConsumptionBar({ consumptionPercentage }: { consumptionPercentage: number }) {
  return (
    <div className="bg-muted mt-1 h-2 w-full overflow-hidden rounded-full">
      <div
        className="bg-brand-secondary h-full rounded-full"
        style={{
          width: `${consumptionPercentage}%`,
        }}
        title={`${Math.round(consumptionPercentage)}% of total consumption`}
      />
    </div>
  );
}
