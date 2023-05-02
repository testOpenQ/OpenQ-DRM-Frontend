import { useLatestEvaluation } from "~/providers/EvaluationProvider";
import Contributor from "./developers/Developer";
import WaitingForFirstEvaluation from "../WaitingForFirstEvaluation";
import type { RepoEvaluation } from "~/store/model";

export default function DevelopersTab() {
  const latestEvaluation = useLatestEvaluation<RepoEvaluation>();

  if (!latestEvaluation) {
    return <WaitingForFirstEvaluation />;
  }

  if (!latestEvaluation.children || latestEvaluation.children.length === 0) {
    return (
      <div className="p-3 text-center text-gray-600">
        No contributors evaluated yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {latestEvaluation.children.map((evaluationId) => (
        <Contributor key={evaluationId} evaluationId={evaluationId} />
      ))}
    </div>
  );
}
