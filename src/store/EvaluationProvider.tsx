import { useLiveQuery } from "dexie-react-hooks";
import React, {
  type Context,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import { type Evaluation, getEvaluationsByTypeAndTagetId } from "~/db";

const EvaluationContext = createContext<Evaluation[] | undefined>(undefined);
const LatestEvaluationContext = createContext<Evaluation | undefined>(
  undefined
);

type EvaluationTarget = {
  id: number;
};

type EvaluationType = "repo" | "user" | "org";

export function useEvaluations<TEvaluation = Evaluation>():
  | TEvaluation[]
  | undefined {
  return useContext<TEvaluation[] | undefined>(
    EvaluationContext as Context<TEvaluation[] | undefined>
  );
}

export function useLatestEvaluation<TEvaluation = Evaluation>():
  | TEvaluation
  | undefined {
  return useContext<TEvaluation | undefined>(
    LatestEvaluationContext as Context<TEvaluation | undefined>
  );
}

export function EvaluationProvider({
  children,
  type,
  target,
}: {
  children: ReactNode;
  type: EvaluationType;
  target: EvaluationTarget;
}) {
  const evaluations = useLiveQuery(
    () => getEvaluationsByTypeAndTagetId(type, target.id),
    [target.id]
  );

  const latestEvaluation = evaluations?.[0];

  return (
    <EvaluationContext.Provider value={evaluations}>
      <LatestEvaluationContext.Provider value={latestEvaluation}>
        {children}
      </LatestEvaluationContext.Provider>
    </EvaluationContext.Provider>
  );
}
