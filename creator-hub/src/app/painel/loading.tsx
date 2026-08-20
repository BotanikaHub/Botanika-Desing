import { PageSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
      <PageSkeleton />
    </main>
  );
}
