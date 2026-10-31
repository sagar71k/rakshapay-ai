import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { key: "messageRisk", label: "Message Risk" },
  { key: "urlRisk", label: "URL Risk" },
  { key: "deviceRisk", label: "Device Risk" },
  { key: "transactionRisk", label: "Transaction Risk" },
] as const;

function barColor(value: number) {
  if (value >= 80) return "bg-rose-400";
  if (value >= 60) return "bg-orange-400";
  if (value >= 30) return "bg-amber-400";
  return "bg-emerald-400";
}

export function RiskBreakdown({
  messageRisk,
  urlRisk,
  deviceRisk,
  transactionRisk,
}: {
  messageRisk: number;
  urlRisk: number;
  deviceRisk: number;
  transactionRisk: number;
}) {
  const values = { messageRisk, urlRisk, deviceRisk, transactionRisk };
  return (
    <div className="space-y-3">
      {ITEMS.map((item) => {
        const value = values[item.key];
        return (
          <div key={item.key}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span>{item.label}</span>
              <span className="font-mono text-slate-200">{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn("h-full rounded-full", barColor(value))}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
