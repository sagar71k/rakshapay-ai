import { ShieldCheck } from "lucide-react";

export function ProtectionStatus() {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-300">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-lg font-semibold">ACTIVE</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        Real-time payment protection is monitoring this session.
      </p>
    </div>
  );
}