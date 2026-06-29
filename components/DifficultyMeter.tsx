import { difficultyName } from "@/lib/challenges";

/**
 * Difficulty as plumbob diamonds (◆, Sims-style) PLUS text — never icon/colour
 * alone (PRD §15 a11y rule). `showLabel` renders the visible "Hard (3/5)" text.
 */
export default function DifficultyMeter({
  difficulty,
  label,
  showLabel = false,
}: {
  difficulty: number;
  label?: string;
  showLabel?: boolean;
}) {
  const name = label ?? difficultyName(difficulty);
  const text = `${name} (${difficulty}/5)`;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span className="meter" role="img" aria-label={`Difficulty: ${text}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= difficulty ? "pip on" : "pip"} aria-hidden="true">
            {i <= difficulty ? "◆" : "◇"}
          </span>
        ))}
      </span>
      {showLabel && <span className="diff-label">{text}</span>}
    </span>
  );
}
