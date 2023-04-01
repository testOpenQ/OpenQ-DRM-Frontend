import SidebarLink from "./SidebarLink";
import RequestInfo from "../RequestInfo";
import SidebarHeader from "./SidebarHeader";
import {
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  CodeBracketIcon,
  BookOpenIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useLiveQuery } from "dexie-react-hooks";
import { getCampaigns } from "~/db";
import SidebarLinkSubmenu from "./SidebarLinkSubmenu";
import SidebarDivider from "./SidebarDivider";
import ConnectGithub from "../ConnectGithub";

export default function Sidebar() {
  const campaigns = useLiveQuery(getCampaigns);

  return (
    <div className="flex w-[320px] flex-col border-r border-zinc-700 bg-gray-800">
      <ConnectGithub />
      <RequestInfo />
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
      <SidebarDivider />
      <SidebarLink href="/users">
        <div className="mr-3 p-1.5">
          <UsersIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Developers
      </SidebarLink>
      <SidebarDivider />
      <SidebarLink href="/repos">
        <div className="mr-3 p-1.5">
          <CodeBracketIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Repositories
      </SidebarLink>

      <SidebarLink href="https://openq.dev/marketplace" className="mt-auto">
        <div className="mr-3 p-1.5">
          <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Marketplace
        <div className="ml-auto p-1.5">
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
        </div>
      </SidebarLink>
      <SidebarLink href="https://openq.dev/hackathons">
        <div className="mr-3 p-1.5">
          <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Hackathons
        <div className="ml-auto p-1.5">
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
        </div>
      </SidebarLink>
      <SidebarLink href="/">
        <div className="mr-3 p-1.5">
          <BookOpenIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Documentation
        <div className="ml-auto p-1.5">
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
        </div>
      </SidebarLink>
      <SidebarDivider />
      <SidebarLink href="/">
        <div className="mr-3 p-1.5">
          <InformationCircleIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-300" />
        </div>
        Contact
        <div className="ml-auto p-1.5">
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600 transition-all group-hover:text-gray-500" />
        </div>
      </SidebarLink>
    </div>
  );
}
