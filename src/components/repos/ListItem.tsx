import { TrashIcon } from '@heroicons/react/24/outline';
import { removeRepository, type Repository } from '@mktcodelib/github-insights';
import Link from 'next/link';
import Button from '../base/Button';

export default function ListItem({ repo }: { repo: Repository }) {
  function handleRemoveRepository() {
    removeRepository(repo.id).catch((err) => console.log(err));
  }
  
  return (
    <>
      <div className="flex space-x-3 w-full">
        <Link className="w-full" href={`/repos/${repo.id}`}>
          <Button>{repo.owner}/{repo.name}</Button>
        </Link>
        <Button className="flex-1" onClick={() => handleRemoveRepository}>
          <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
        </Button>
      </div>
    </>
  );
}
