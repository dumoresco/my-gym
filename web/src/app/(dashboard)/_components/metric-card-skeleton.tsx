"use client";

import { Skeleton } from "@/components/ui/skeleton";

const MetricCardSkeleton = () => {
  return (
    <div className="flex flex-col border p-4 roundeda bg-muted/40">
      <div className="flex items-center justify-between">
        <h4>
          <Skeleton className="w-32 h-4" />
        </h4>
        <Skeleton className="w-6 h-6" />
      </div>
      <Skeleton className="w-24 h-10 mt-2" />
    </div>
  );
};

export default MetricCardSkeleton;
