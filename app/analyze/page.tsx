import { MessageAnalyzer } from "@/components/analysis/AnalyzerForm";

export default function AnalyzePage() {
  return (
    <MessageAnalyzer
      title="Scam Message Analyzer"
      endpoint="/api/analyze/message"
      placeholder="Your SBI KYC has expired. Click this link immediately to avoid account suspension..."
    />
  );
}
