import Link from "next/link";
import type { ChallengeWithSlug } from "@/lib/types";
import DifficultyMeter from "./DifficultyMeter";
import PlayabilityBadge from "./PlayabilityBadge";

export default function ChallengeCard({ challenge }: { challenge: ChallengeWithSlug }) {
  return (
    <Link className="card" href={`/challenge/${challenge.slug}`}>
      <span className="cat">{challenge.category}</span>
      <h3>{challenge.title}</h3>
      <p className="prem">{challenge.premise}</p>
      <div className="row">
        <DifficultyMeter
          difficulty={challenge.difficulty}
          label={challenge.difficultyLabel}
          showLabel
        />
        <PlayabilityBadge challenge={challenge} />
      </div>
    </Link>
  );
}
