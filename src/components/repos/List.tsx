import { getRepositories, Repository } from '@mktcodelib/github-insights';
import { useObservable } from 'dexie-react-hooks';
import ListItem from './ListItem';
import Add from './Add';

export default function ReposList() {
  const repos = useObservable<Repository[]>(() => getRepositories())

  return (
    <>
      <Add />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        {repos && repos.map((repo) => (
          <ListItem key={repo.id} repo={repo} />
        ))}
      </div>
    </>
  );
}
