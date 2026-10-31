import type { PaymentReviewResult } from "@/types/transaction";

const KEY = "rakshapay_last_review";

export function saveLastReview(result: PaymentReviewResult) {
  try {
    localStorage.setItem(KEY, JSON.stringify(result));
  } catch {
    // ignore quota
  }
}

export function loadLastReview(): PaymentReviewResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PaymentReviewResult) : null;
  } catch {
    return null;
  }
}
