import Image from "next/image";

type AvatarProps = {
  name: string;
  avatarUrl: string;
  size: number;
};

export function Avatar({ name, avatarUrl, size }: AvatarProps) {
  if (avatarUrl.length === 0) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center border border-foreground/20 bg-white text-sm font-semibold"
        style={{ height: size, width: size }}
      >
        {name.slice(0, 1)}
      </span>
    );
  }

  return (
    <Image
      alt=""
      className="shrink-0 border border-foreground/20 bg-white object-cover"
      height={size}
      loading="lazy"
      sizes={`${size}px`}
      src={avatarUrl}
      style={{ height: size, width: size }}
      width={size}
    />
  );
}
