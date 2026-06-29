import { KOFI_URL } from "@/lib/config";

/** Link-out to Ko-fi. Always opens in a new tab, no data collected. */
export default function KofiButton({
  className = "ghost-btn",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
