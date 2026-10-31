import type { Decision } from "./risk";
import type { DeviceSignals } from "./analysis";

export type DemoScenario = {
  id: string;
  name: string;
  description: string;
  message: string;
  url: string;
  amount: number;
  recipientName: string;
  recipientUpi: string;
  newRecipient: boolean;
  knownRecipient: boolean;
  device: DeviceSignals;
  expectedDecision: Decision;
};
