import { getRepo } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Card from "./Card";
import Headline from "../layout/Headline";

export default function RepoDetails({ repoId }: { repoId: string }) {
  const repo = useLiveQuery(getRepo(repoId));

  if (!repo) return <>Repository does not exist.</>;

  return (
    <>
      <Headline>
        {repo.owner}/{repo.name}
      </Headline>
      <Card repo={repo} />
    </>
  );
}
