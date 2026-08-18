export default function FinanceLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-72 rounded-md bg-muted" />
          <div className="h-4 w-56 rounded-md bg-muted" />
        </div>

        <div className="h-10 w-36 rounded-md bg-muted" />
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border bg-muted"
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="h-14 rounded-xl border bg-muted" />

      {/* Table */}
      <div className="rounded-xl border">
        <div className="h-12 border-b bg-muted" />

        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-14 border-b bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}