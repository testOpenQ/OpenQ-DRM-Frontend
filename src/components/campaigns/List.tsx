import { getCampaigns, type Campaign } from '@mktcodelib/github-insights';
import { useObservable } from 'dexie-react-hooks';
import ListItem from './ListItem';
import Add from './Add';

export default function CampaignsList() {
  const campaigns = useObservable<Campaign[]>(() => getCampaigns())

  return (
    <div className="space-y-3 w-full max-w-md flex flex-col items-center">
      <Add />
      {campaigns && campaigns.map((campaign) => (
        <ListItem key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
