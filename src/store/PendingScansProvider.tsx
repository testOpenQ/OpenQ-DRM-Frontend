import { Scan, Scanner } from "@mktcodelib/github-insights";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect } from "react";
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
  const { data } = useSession();
  const viewerToken = data?.accessToken;
  const livePendingScans = useLiveQuery(
    () => getPendingScans() as Promise<Scan[]>
  );

  useEffect(() => {
    if (!viewerToken) return;

    const scanner = new Scanner({ viewerToken });

    getPendingScans().then((pendingScans) => {
      pendingScans.forEach((scan) => {
        scanner.scanContinue((scan as Scan).id);
      });
    });
  }, []);

  if (!livePendingScans) return null;

  return (
    <PendingScansContext.Provider value={livePendingScans}>
      {children}
    </PendingScansContext.Provider>
  );
}
