import { cn } from "@/lib/utils/cn";
import type { ThreatLevel } from "@/types/risk";

const COLORS: Record<ThreatLevel, string> = {
  SAFE: "#34d399",
  LOW: "#67e8f9",
  MEDIUM: "#fbbf24",
  HIGH: "#fb923c",
  CRITICAL: "#fb7185",
};

export function RiskScoreGauge({
  score,
  severity,
  size = 180,
}: {
  score: number;
  severity: ThreatLevel;
  size?: number;
}) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  const color = COLORS[severity];

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Risk score ${score} of 100, ${severity}`}>
      <svg width={size} height={size} viewBox="0 0 180 180" className="overflow-visible">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="82" textAnchor="middle" fill="#e8eef7" fontSize="32" fontWeight="700">
          {score}
        </text>
        <text x="90" y="104" textAnchor="middle" fill="#8b9bb4" fontSize="12">
          / 100
        </text>
      </svg>
      <p className={cn("text-xs font-semibold tracking-[0.2em]")} style={{ color }}>
        {severity}
      </p>
    </div>
  );
}
