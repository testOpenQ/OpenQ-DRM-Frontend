import { getPendingScans, type Scan } from "@mktcodelib/github-insights";
import { useLiveQuery } from "dexie-react-hooks";
import LoadingSpinner from "./LoadingSpinner";

export default function RequestInfo() {
  const pendingScans = useLiveQuery(() => getPendingScans() as Promise<Scan[]>);

  if (!pendingScans) {
    return <div>Loading...</div>;
  }

  if (pendingScans.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-gray-600">
      <LoadingSpinner className="text-zinc-600" />
      <div>Pending scans: {pendingScans.length}</div>
    </div>
  );
}
