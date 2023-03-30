import Image from "next/image";
import ConnectGithub from "../ConnectGithub";
import NavigationLink from "./NavigationLink";
import { useState } from "react";

export default function Navigation() {
  const [showExternalLinks, setShowExternalLinks] = useState(false);

  return (
    <div className="flex items-center border-b border-gray-700 bg-gray-800 text-sm text-gray-400">
      <div
        className={`cursor-pointer px-3 transition-all hover:opacity-100 ${
          showExternalLinks ? "opacity-100" : "opacity-30"
        }`}
        onClick={() => setShowExternalLinks(!showExternalLinks)}
      >
        <Image
          src="/openq-logo-white.png"
          alt="OpenQ"
          width="20"
          height="20"
          className="h-5 w-5"
        />
      </div>
      <div
        className={`flex overflow-hidden whitespace-nowrap transition-all duration-300 ${
          showExternalLinks ? "max-w-md" : "max-w-0"
        }`}
      >
        <NavigationLink target="_blank" href="https://openq.dev">
          Explore
        </NavigationLink>
        <NavigationLink target="_blank" href="https://openq.dev/marketplace">
          Marketplace
        </NavigationLink>
        <NavigationLink target="_blank" href="https://openq.dev/hackathons">
          Hackathons
        </NavigationLink>
        <NavigationLink
          target="_blank"
          href="https://openq.dev/good-first-issues"
        >
          Good First Issues
        </NavigationLink>
      </div>
      <div className="mr-auto">
        <NavigationLink href="/">Overview</NavigationLink>
      </div>
      <ConnectGithub />
    </div>
  );
}
