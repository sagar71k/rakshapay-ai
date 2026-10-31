import type { DeviceSignals } from "@/types/analysis";
import type { RiskContributor } from "@/types/risk";
import { DEVICE_RISK_POINTS, clampScore } from "@/lib/risk/risk-config";

export function computeDeviceRisk(signals: DeviceSignals): {
  score: number;
  contributors: RiskContributor[];
} {
  const contributors: RiskContributor[] = [];
  let score = 0;

  if (signals.remoteAccess) {
    score += DEVICE_RISK_POINTS.remoteAccess;
    contributors.push({
      key: "remote_access",
      label: "Remote-access risk detected",
      points: DEVICE_RISK_POINTS.remoteAccess,
      category: "device",
    });
  }
  if (signals.screenSharing) {
    score += DEVICE_RISK_POINTS.screenSharing;
    contributors.push({
      key: "screen_sharing",
      label: "Screen sharing active",
      points: DEVICE_RISK_POINTS.screenSharing,
      category: "device",
    });
  }
  if (signals.unknownSource) {
    score += DEVICE_RISK_POINTS.unknownSource;
    contributors.push({
      key: "unknown_source",
      label: "Unknown application source",
      points: DEVICE_RISK_POINTS.unknownSource,
      category: "device",
    });
  }
  if (signals.accessibilityRisk) {
    score += DEVICE_RISK_POINTS.accessibilityRisk;
    contributors.push({
      key: "accessibility",
      label: "Accessibility service risk",
      points: DEVICE_RISK_POINTS.accessibilityRisk,
      category: "device",
    });
  }

  return { score: clampScore(score), contributors };
}
