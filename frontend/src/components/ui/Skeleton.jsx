export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-[#2A2A2A] rounded animate-pulse ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1E1E1E] rounded-lg border border-[#333] p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}
