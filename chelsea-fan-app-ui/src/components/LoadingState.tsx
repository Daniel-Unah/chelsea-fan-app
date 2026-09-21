export default function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-12 text-gray-500 dark:text-gray-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
