import { Suspense } from "react";
import { PaymentWorkbench } from "@/components/payment/PaymentWorkbench";
import { LoadingState } from "@/components/layout/states";

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading simulated payment…" />}>
      <PaymentWorkbench />
    </Suspense>
  );
}
