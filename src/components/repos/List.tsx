import { getRepositories, type Repository } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import ListItem from "./ListItem";
import Add from "./Add";

export default function ReposList() {
  const repos = useObservable<Repository[]>(() => getRepositories());

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-3">
      <Add />
      {repos && repos.map((repo) => <ListItem key={repo.id} repo={repo} />)}
    </div>
  );
}
