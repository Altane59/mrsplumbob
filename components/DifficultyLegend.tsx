import { DIFFICULTY_NAME } from "@/lib/challenges";

/**
 * Small text legend explaining the 1–5 plumbob-diamond difficulty scale, so the
 * ◆ meter is never colour/shape-only (PRD §15 a11y rule).
 */
export default function DifficultyLegend() {
  const scale = [1, 2, 3, 4, 5].map((d) => `${d} ${DIFFICULTY_NAME[d]}`).join(" · ");
  return (
    <p
      style={{
        fontSize: 12.5,
        color: "var(--muted)",
        fontWeight: 600,
        margin: "0 0 18px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        flexWrap: "wrap",
      }}
    >
      <span aria-hidden="true" className="meter">
        <span className="pip on">◆</span>
      </span>
      <span>Difficulty (1–5 plumbobs): {scale}</span>
    </p>
  );
}
