import { useLatestEvaluation } from "~/store/EvaluationProvider";
import Contributor from "./developers/Developer";
import WaitingForFirstEvaluation from "../WaitingForFirstEvaluation";
import type { RepoEvaluation } from "~/db";

export default function DevelopersTab() {
  const latestEvaluation = useLatestEvaluation<RepoEvaluation>();

  if (!latestEvaluation) {
    return <WaitingForFirstEvaluation />;
  }

  if (!latestEvaluation.children || latestEvaluation.children.length === 0) {
    return <div>No contributors evaluated yet.</div>;
  }

  return (
    <div className="space-y-3 p-3">
      {latestEvaluation.children.map((evaluationId) => (
        <Contributor key={evaluationId} evaluationId={evaluationId} />
      ))}
    </div>
  );
}
