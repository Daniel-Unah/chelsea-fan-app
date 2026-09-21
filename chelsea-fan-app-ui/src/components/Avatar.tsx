import Image from 'next/image';

export default function Avatar({
  name,
  url,
  size = 40,
}: {
  name: string;
  url?: string | null;
  size?: number;
}) {
  const initial = (name.trim()[0] || 'C').toUpperCase();

  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full bg-blue-700 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-700 font-semibold text-white"
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.4) }}
    >
      {initial}
    </span>
  );
}
