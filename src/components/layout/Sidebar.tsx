import SidebarLink from "./SidebarLink";
import RequestInfo from "../RequestInfo";
import SidebarHeader from "./SidebarHeader";
import {
  ArrowDownTrayIcon,
  UsersIcon,
  CodeBracketIcon,
  BookOpenIcon,
  InformationCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import { getCampaigns } from "~/db";
import SidebarLinkSubmenu from "./SidebarLinkSubmenu";

export default function Sidebar() {
  const campaigns = useLiveQuery(getCampaigns);

  return (
    <div className="flex w-[320px] flex-col border-r border-zinc-700 bg-gray-800">
      <RequestInfo />
      <SidebarLink href="/">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <Squares2X2Icon className="h-5 w-5 text-gray-300" />
        </div>
        Overview
      </SidebarLink>
      <SidebarHeader label="Campaigns">
        {campaigns?.map((campaign) => (
          <SidebarLinkSubmenu
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
          >
            {campaign.name}
          </SidebarLinkSubmenu>
        ))}
      </SidebarHeader>
      <SidebarLink href="/users">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <UsersIcon className="h-5 w-5 text-gray-300" />
        </div>
        Developers
      </SidebarLink>
      <SidebarLink href="/repos">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <CodeBracketIcon className="h-5 w-5 text-gray-300" />
        </div>
        Repositories
      </SidebarLink>

      <SidebarLink href="/" className="mt-auto">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-300" />
        </div>
        Import
      </SidebarLink>
      <SidebarLink href="/">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <BookOpenIcon className="h-5 w-5 text-gray-300" />
        </div>
        Documentation
      </SidebarLink>
      <SidebarLink href="/">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <InformationCircleIcon className="h-5 w-5 text-gray-300" />
        </div>
        Contact
      </SidebarLink>
    </div>
  );
}
