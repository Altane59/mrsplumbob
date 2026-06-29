"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

/**
 * Marks the challenge as started (so it appears in "My Challenges") and takes
 * the user there. Started state is persisted client-side — no account needed.
 */
export default function StartChallengeButton({ challengeId }: { challengeId: string }) {
  const router = useRouter();
  const startChallenge = useStore((s) => s.startChallenge);

  return (
    <button
      type="button"
      className="big-btn"
      onClick={() => {
        startChallenge(challengeId);
        router.push("/progress");
      }}
    >
      🎮 Start this challenge →
    </button>
  );
}
