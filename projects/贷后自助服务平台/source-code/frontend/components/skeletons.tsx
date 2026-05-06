export function RepaymentSkeleton() {
  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b p-3">
        <div className="skeleton h-4 w-24" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between border-b p-3 last:border-0">
          <div>
            <div className="skeleton mb-1 h-4 w-16" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="text-right">
            <div className="skeleton mb-1 h-4 w-20" />
            <div className="skeleton h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}
