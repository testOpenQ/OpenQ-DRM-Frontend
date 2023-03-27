import { TrashIcon } from '@heroicons/react/24/outline';
import { removeCampaign, type Campaign } from '@mktcodelib/github-insights';
import Link from 'next/link';
import Button from '../base/Button';

export default function ListItem({ campaign }: { campaign: Campaign }) {
  return (
    <div className="flex space-x-3 w-full">
      <Link className="w-full" href={`/campaigns/${campaign.id}`}>
        <Button>{campaign.name}</Button>
      </Link>
      <Button className="flex-1" onClick={() => removeCampaign(campaign.id!)}>
        <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
      </Button>
    </div>
  );
}
