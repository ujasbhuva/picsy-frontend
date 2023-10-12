interface CommonLoaderProps {
  parentClassName?: string;
  childClassName?: string;
}

export function CommonLoader({
  parentClassName,
  childClassName,
}: CommonLoaderProps) {
  return (
    <div className={`flex items-center ${parentClassName}`}>
      <div
        className={`animate-spin rounded-full border-b-teal-500 border-r-teal-500 border-t-blue-2 border-l-blue-2 ${childClassName}`}
      />
    </div>
  );
}
