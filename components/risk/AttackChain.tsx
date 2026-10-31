import { cn } from "@/lib/utils/cn";

export function AttackChain({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-0" aria-label="Attack chain">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        const isDecision = /blocked|held|allowed|verification/i.test(step);
        return (
          <li key={`${step}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-0.5 h-2.5 w-2.5 rounded-full",
                  last && isDecision ? "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]" : "bg-cyan-400",
                )}
              />
              {!last ? <span className="w-px flex-1 bg-slate-700" /> : null}
            </div>
            <p
              className={cn(
                "pb-4 text-sm",
                last ? "font-semibold tracking-wide text-rose-200" : "text-slate-200",
              )}
            >
              <span className="mr-2 font-mono text-[11px] text-slate-500">{index + 1}.</span>
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
