import { type Scan } from "@mktcodelib/github-scanner";
import { useLiveQuery } from "dexie-react-hooks";
import React, { createContext, useContext } from "react";
import { getPendingScans } from "~/db";

const PendingScansContext = createContext<Scan[]>([]);

export function usePendingScans() {
  return useContext(PendingScansContext);
}

export function PendingScansProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const livePendingScans = useLiveQuery(
    () => getPendingScans() as Promise<Scan[]>
  );

  if (!livePendingScans) return null;

  return (
    <PendingScansContext.Provider value={livePendingScans}>
      {children}
    </PendingScansContext.Provider>
  );
}
