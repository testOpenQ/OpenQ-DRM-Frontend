import { getRepos } from "~/db";
import ListItem from "./ListItem";
import Add from "./Add";
import { useLiveQuery } from "dexie-react-hooks";

export default function ReposList() {
  const repos = useLiveQuery(getRepos);

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-3">
      <Add />
      {repos && repos.map((repo) => <ListItem key={repo.id} repo={repo} />)}
    </div>
  );
}
