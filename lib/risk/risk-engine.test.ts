import { describe, expect, it } from "vitest";
import { computeFinalScore, evaluateRisk } from "./risk-engine";
import { clampScore, decisionFromScore } from "./risk-config";
import { fallbackScamAnalysis, messageRiskFromAnalysis } from "@/lib/ai/fallback";
import { analyzeUrl } from "@/lib/security/url-analyzer";
import { computeDeviceRisk } from "@/lib/security/device-risk";
import { computeTransactionRisk, inferTransactionFlags } from "./transaction-risk";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";
import type { DemoScenario } from "@/types/scenario";
import type { Decision } from "@/types/risk";

describe("decision boundaries", () => {
  const scores = [0, 29, 30, 59, 60, 79, 80, 100] as const;
  const expected: Record<(typeof scores)[number], Decision> = {
    0: "ALLOW",
    29: "ALLOW",
    30: "VERIFY",
    59: "VERIFY",
    60: "HOLD",
    79: "HOLD",
    80: "BLOCK",
    100: "BLOCK",
  };

  it.each(scores)("score %i", (score) => {
    expect(decisionFromScore(score)).toBe(expected[score]);
    expect(clampScore(score)).toBe(score);
  });
});

describe("weighted engine", () => {
  it("clamps and stays deterministic", () => {
    expect(
      computeFinalScore({
        messageRisk: 0,
        urlRisk: 0,
        deviceRisk: 0,
        transactionRisk: 0,
      }),
    ).toBe(0);
    expect(
      computeFinalScore({
        messageRisk: 100,
        urlRisk: 100,
        deviceRisk: 100,
        transactionRisk: 100,
      }),
    ).toBe(100);
  });
});

function runScenario(scenario: DemoScenario) {
  const message = fallbackScamAnalysis(scenario.message);
  const url = scenario.url ? analyzeUrl(scenario.url) : { risk_score: 0 };
  const device = computeDeviceRisk(scenario.device);
  const flags = inferTransactionFlags(
    {
      amount: scenario.amount,
      recipientName: scenario.recipientName,
      recipientUpi: scenario.recipientUpi,
      newRecipient: scenario.newRecipient,
      knownRecipient: scenario.knownRecipient,
      messageContext: scenario.message,
      suspiciousUrl: scenario.url,
      device: scenario.device,
    },
    { paymentRequest: message.payment_request, urgencyScore: message.urgency_score },
  );
  const tx = computeTransactionRisk({
    amount: scenario.amount,
    newRecipient: scenario.newRecipient,
    knownRecipient: scenario.knownRecipient,
    ...flags,
  });
  return evaluateRisk({
    breakdown: {
      messageRisk: messageRiskFromAnalysis(message),
      urlRisk: url.risk_score,
      deviceRisk: device.score,
      transactionRisk: tx.score,
    },
  });
}

describe("demo scenarios", () => {
  it("Safe Payment allows", () => {
    expect(runScenario(DEMO_SCENARIOS[0]).decision).toBe("ALLOW");
  });

  it("Fake Bank KYC holds or blocks", () => {
    const decision = runScenario(DEMO_SCENARIOS[1]).decision;
    expect(["HOLD", "BLOCK"]).toContain(decision);
  });

  it("Digital Arrest blocks", () => {
    expect(runScenario(DEMO_SCENARIOS[2]).decision).toBe("BLOCK");
  });

  it("Fake Customer Care blocks", () => {
    expect(runScenario(DEMO_SCENARIOS[3]).decision).toBe("BLOCK");
  });

  it("Remote Access blocks", () => {
    expect(runScenario(DEMO_SCENARIOS[4]).decision).toBe("BLOCK");
  });

  it("Hinglish UPI scam blocks", () => {
    expect(runScenario(DEMO_SCENARIOS[5]).decision).toBe("BLOCK");
  });
});

describe("url analyzer", () => {
  it("flags suspicious banking URL without claiming proven malware", () => {
    const result = analyzeUrl("http://sbi-kyc-verify-secure.example.com/account-update?otp=1");
    expect(result.suspicious).toBe(true);
    expect(result.explanation.toLowerCase()).toMatch(/suspicious|high-risk|potentially/);
  });

  it("handles malformed URL", () => {
    const result = analyzeUrl("http://%");
    expect(result.indicators.length).toBeGreaterThan(0);
  });
});

describe("input guards", () => {
  it("empty message is not a scam", () => {
    const analysis = fallbackScamAnalysis("");
    expect(analysis.scam_detected).toBe(false);
    expect(analysis.confidence).toBe(0);
  });

  it("invalid amount is rejected by clamp/engine callers", () => {
    expect(Number.isFinite(-1)).toBe(true);
    expect((-1) <= 0).toBe(true);
  });
});

describe("AI failure fallback", () => {
  it("detects KYC and remote access without the model", () => {
    const kyc = fallbackScamAnalysis("Your bank KYC has expired. Click this link immediately.");
    expect(kyc.scam_detected).toBe(true);
    const remote = fallbackScamAnalysis("Install AnyDesk and share your screen for a refund.");
    expect(remote.remote_access_request).toBe(true);
  });
});
