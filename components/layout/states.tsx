export function LoadingState({ label = "Running protection analysis…" }: { label?: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-6 text-sm text-slate-300" role="status">
      {label}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-5" role="alert">
      <p className="text-sm text-rose-100">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-rose-300/30 px-3 py-1.5 text-xs text-rose-100"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-8 text-center">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  );
}
