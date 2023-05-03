import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";
import Layout from "~/components/layout/Layout";
import { PendingScansProvider } from "~/store/PendingScansProvider";
import { CampaignsProvider } from "~/store/CampaignsProvider";
import { UserProvider } from "~/store/UserProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PendingScansProvider>
        <CampaignsProvider>
          <UserProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserProvider>
        </CampaignsProvider>
      </PendingScansProvider>
    </SessionProvider>
  );
};

export default MyApp;
