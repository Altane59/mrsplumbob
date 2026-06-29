import type { ChallengeWithSlug } from "@/lib/types";
import ChallengeCard from "./ChallengeCard";

export default function ChallengeGrid({
  challenges,
  empty,
}: {
  challenges: ChallengeWithSlug[];
  empty?: React.ReactNode;
}) {
  if (challenges.length === 0) {
    return <div className="empty">{empty ?? "Nothing here yet. 💝"}</div>;
  }
  return (
    <div className="grid">
      {challenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}
