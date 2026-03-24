export function LoadingSkeleton({
  count = 1,
  height = "h-12",
}: {
  count?: number;
  height?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gray-200 rounded-lg animate-pulse`}
        />
      ))}
    </>
  );
}
