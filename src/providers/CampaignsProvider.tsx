import { useLiveQuery } from "dexie-react-hooks";
import React, { createContext, useContext } from "react";
import { getCampaigns } from "~/store";
import type { Campaign } from "~/store/model";

const CampaignsContext = createContext<Campaign[]>([]);

export function useCampaigns() {
  return useContext(CampaignsContext);
}

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const liveCampaigns = useLiveQuery(getCampaigns);

  if (!liveCampaigns) return null;

  return (
    <CampaignsContext.Provider value={liveCampaigns}>
      {children}
    </CampaignsContext.Provider>
  );
}
