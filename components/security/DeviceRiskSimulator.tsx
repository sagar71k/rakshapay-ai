"use client";

import type { DeviceSignals } from "@/types/analysis";

const FIELDS: Array<{ key: keyof DeviceSignals; label: string; hint: string }> = [
  { key: "remoteAccess", label: "Remote access application detected", hint: "+40" },
  { key: "screenSharing", label: "Screen sharing active", hint: "+30" },
  { key: "unknownSource", label: "Unknown application source", hint: "+20" },
  { key: "accessibilityRisk", label: "Accessibility service risk", hint: "+10" },
];

export function DeviceRiskSimulator({
  value,
  onChange,
}: {
  value: DeviceSignals;
  onChange: (next: DeviceSignals) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-xs font-semibold tracking-[0.18em] text-slate-400">
        PROTOTYPE DEVICE SECURITY SIGNAL
      </legend>
      <p className="text-xs leading-5 text-slate-500">
        This is a demo control. The browser cannot inspect apps installed on a real phone.
      </p>
      {FIELDS.map((field) => (
        <label key={field.key} className="flex cursor-pointer items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-cyan-400"
              checked={value[field.key]}
              onChange={(event) => onChange({ ...value, [field.key]: event.target.checked })}
            />
            {field.label}
          </span>
          <span className="font-mono text-xs text-slate-500">{field.hint}</span>
        </label>
      ))}
    </fieldset>
  );
}
