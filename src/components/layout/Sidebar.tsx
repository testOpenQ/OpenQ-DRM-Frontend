import SidebarLink from "./SidebarLink";
import { UsersIcon } from "@heroicons/react/24/outline";
import RequestInfo from "../RequestInfo";

export default function Sidebar() {
  return (
    <div className="flex w-[320px] flex-col border-r border-zinc-700 bg-gray-800 p-3 text-sm">
      <SidebarLink href="/">Dashboard</SidebarLink>
      <SidebarLink href="/campaigns">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <UsersIcon className="h-4 w-4 text-gray-300" />
        </div>
        Campaigns
      </SidebarLink>
      <SidebarLink href="/repos">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <UsersIcon className="h-4 w-4 text-gray-300" />
        </div>
        Repositories
      </SidebarLink>
      <SidebarLink href="/users">
        <div className="mr-3 rounded-lg bg-gray-600 p-1">
          <UsersIcon className="h-4 w-4 text-gray-300" />
        </div>
        Users
      </SidebarLink>
      <div className="mt-auto">
        <RequestInfo />
      </div>
    </div>
  );
}
