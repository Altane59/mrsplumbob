/** The green plumbob — kept only as the small brand logo (build prompt). */
export default function PlumbobLogo({ size = 22 }: { size?: number }) {
  const h = Math.round((size / 22) * 26);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 22 26"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 3px 6px rgba(62,210,126,.45))" }}
    >
      <path d="M11 0L22 13L11 26L0 13Z" fill="#3ed27e" />
      <path d="M11 4.5L17.5 13L11 21.5L4.5 13Z" fill="#eafff5" />
      <path d="M11 8L14 13L11 18L8 13Z" fill="#3ed27e" />
    </svg>
  );
}
