import { MessageAnalyzer } from "@/components/analysis/AnalyzerForm";

export default function TranscriptPage() {
  return (
    <MessageAnalyzer
      title="Call Transcript Analyzer"
      endpoint="/api/analyze/transcript"
      placeholder="Sir I am calling from your bank. Your account will be blocked in 10 minutes. Install this application so I can help you..."
    />
  );
}
