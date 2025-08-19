export default function Loading() {
  const items = Array.from({ length: 5 });

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Top progress bar */}
      <div className="sticky top-0 z-50 h-1 w-full overflow-hidden bg-transparent">
        <div className="h-full w-1/3 rounded-r-full bg-gradient-to-r from-indigo-500 to-blue-500 motion-safe:animate-slide motion-reduce:animate-none" />
      </div>

      {/* Background blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-slate-400/20 to-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl p-6">
        {/* Header skeleton */}
        <section
          role="status"
          aria-label="Loading products header"
          className="mb-8 flex items-center justify-between rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </section>

        {/* List skeletons */}
        <ul className="space-y-4" aria-label="Loading product list" role="status">
          {items.map((_, i) => (
            <li
              key={i}
              className="group rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-5 w-44 rounded-lg" />

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-72 rounded" />
                    <Skeleton className="h-3 w-56 rounded" />
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>

                <div className="ml-6 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination dots */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-10 rounded-lg"
                style={{ animationDelay: `${(i + items.length) * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/** Reusable shimmer skeleton */
function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={[
        "bg-[linear-gradient(90deg,theme(colors.slate.200),theme(colors.slate.100),theme(colors.slate.200))]",
        "bg-[length:200%_100%] motion-safe:animate-shimmer motion-reduce:animate-none",
        className,
      ].join(" ")}
      style={style}
    />
  );
}
