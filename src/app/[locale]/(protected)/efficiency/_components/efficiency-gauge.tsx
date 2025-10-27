import { useTranslations } from "next-intl";

import { Thresholds } from "@domain/entities/efficiency";

type GaugeProps = {
  thresholds: Thresholds;
  value: number;
  width?: number;
  height?: number;
  colors?: [string, string, string];
  stroke?: string;
  strokeWidth?: number;
  showOutline?: boolean;
};

export function EfficiencyGauge({
  thresholds,
  value,
  width = 500,
  height = 200,
  colors = [
    "hsl(var(--brand-secondary))",
    "hsl(var(--brand-tertiary))",
    "hsl(var(--brand-quaternary))",
  ],
  stroke = "hsl(var(--brand-primary))",
  strokeWidth = 12,
  showOutline = true,
}: GaugeProps) {
  const t = useTranslations("efficiency.gauge");
  const w = width;
  const h = height ?? Math.round(width / 2);
  const hubR = strokeWidth;
  const inset = strokeWidth + 24;

  const cx = w / 2;
  const cy = h + inset;
  const R = Math.min(w / 2, h) - inset / 2;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const point = (deg: number) => ({
    x: cx + R * Math.cos(toRad(deg)),
    y: cy - R * Math.sin(toRad(deg)),
  });

  const sector = (a0: number, a1: number) => {
    const p0 = point(a0);
    const p1 = point(a1);
    return [`M ${cx} ${cy}`, `L ${p0.x} ${p0.y}`, `A ${R} ${R} 0 0 1 ${p1.x} ${p1.y}`, "Z"].join(
      " "
    );
  };

  const outerArc = () => {
    const s = point(180);
    const e = point(0);
    return [`M ${s.x} ${s.y}`, `A ${R} ${R} 0 0 1 ${e.x} ${e.y}`].join(" ");
  };

  const [t1, t2, t3] = thresholds;
  const capped = Math.max(0, Math.min(value, t3));
  const seg = 60;
  let needle = 180;
  if (capped <= t1) needle = 180 - (t1 ? (capped / t1) * seg : 0);
  else if (capped <= t2) needle = 120 - ((capped - t1) / (t2 - t1 || 1)) * seg;
  else needle = 60 - ((capped - t2) / (t3 - t2 || 1)) * seg;

  const rot = 90 - needle;

  const hubCx = w / 2;
  const hubCy = h + 16 + hubR;
  const apexX = w / 2;
  const apexY = hubCy - 100;

  const dx = apexX - hubCx;
  const dy = apexY - hubCy;
  const dist = Math.hypot(dx, dy);

  const needlePath =
    dist <= hubR
      ? ""
      : (() => {
          const perp = hubR * Math.sqrt(1 - (hubR * hubR) / (dist * dist));
          const baseX = hubCx + (hubR * hubR * dx) / (dist * dist);
          const baseY = hubCy + (hubR * hubR * dy) / (dist * dist);
          const leftX = baseX - (perp * dy) / dist;
          const leftY = baseY + (perp * dx) / dist;
          const rightX = baseX + (perp * dy) / dist;
          const rightY = baseY - (perp * dx) / dist;
          return `M ${leftX},${leftY} L ${rightX},${rightY} L ${apexX},${apexY} Z`;
        })();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h + inset * 2}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Semicircle with three equal areas"
    >
      <text x="15%" y={h + inset * 1.7} textAnchor="middle" className="text-md" fill="currentColor">
        {t("optimalUse")}
      </text>
      <text x="80%" y={h + inset * 1.7} textAnchor="middle" className="text-md" fill="currentColor">
        {t("waste")}
      </text>
      <path d={sector(180, 120)} fill={colors[0]} />
      <path d={sector(120, 60)} fill={colors[1]} />
      <path d={sector(60, 0)} fill={colors[2]} />
      {showOutline && <path d={outerArc()} fill="none" stroke={stroke} strokeWidth={strokeWidth} />}
      <g transform={`rotate(${rot} ${hubCx} ${hubCy})`}>
        {needlePath && <path d={needlePath} fill="hsl(var(--brand-primary))" />}
        <circle cx={hubCx} cy={hubCy} r={hubR} fill="hsl(var(--brand-primary))" />
      </g>
    </svg>
  );
}
