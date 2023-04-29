import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { RepoScores } from "~/lib/types";

const ScoresContext = createContext<RepoScores>({});
const SubmitScoreContext = createContext<
  (repoId: number, category: string, score: number) => void
>(() => {});

export function useScores() {
  return useContext(ScoresContext);
}

export function useSubmitScore() {
  return useContext(SubmitScoreContext);
}

export function ScoresProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState<RepoScores>({});

  const submitScore = useCallback(
    (repoId: number, category: string, score: number) => {
      const current = scores[repoId] || {
        activity: 0,
        growth: 0,
        popularity: 0,
        reputation: 0,
      };

      setScores((scores) => ({
        ...scores,
        [repoId]: {
          ...current,
          [category]: score,
        },
      }));
    },
    []
  );

  return (
    <ScoresContext.Provider value={scores}>
      <SubmitScoreContext.Provider value={submitScore}>
        {children}
      </SubmitScoreContext.Provider>
    </ScoresContext.Provider>
  );
}
