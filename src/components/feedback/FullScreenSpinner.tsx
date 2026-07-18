import { Loader2 } from 'lucide-react'

export function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div
      role="status"
      className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400"
    >
      <Loader2 className="size-8 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
