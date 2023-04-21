import { type Scan, Scanner } from "@mktcodelib/github-scanner";
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
  const accessToken = data?.accessToken;
  const livePendingScans = useLiveQuery(
    () => getPendingScans() as Promise<Scan[]>
  );

  useEffect(() => {
    if (!accessToken) return;

    const scanner = new Scanner({ accessToken });

    getPendingScans()
      .then((pendingScans) => {
        pendingScans.forEach((scan) => {
          scanner.continueScan((scan as Scan).id);
        });
      })
      .catch(console.error);
  });

  if (!livePendingScans) return null;

  return (
    <PendingScansContext.Provider value={livePendingScans}>
      {children}
    </PendingScansContext.Provider>
  );
}
