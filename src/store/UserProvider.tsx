import React, { createContext, useContext, useState } from "react";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GET_PRO_ACCOUNT_INFO_CURRENT, UPSERT_USER } from "~/lib/openQApi";
import { type User } from "~/lib/openQApi/types";
import axiosClient from "~/lib/axiosClient";

import axios from "axios";

const UserContext = createContext({});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const { data } = useSession();

  useEffect(() => {
    const getUser = async () => {
      console.log("get user");
      if (!data?.accessToken) return;
      const result = await axios.post(
        "http://localhost:3001/ghoTokenToCookie",
        { ghoToken: data?.accessToken },
        {
          withCredentials: true,
        }
      );
      console.log(result);
      type CurrentUserResponse = {
        currentUser: User;
      };
      const { currentUser } = await axiosClient<CurrentUserResponse>(
        GET_PRO_ACCOUNT_INFO_CURRENT,
        data?.accessToken
      );

      setUser(currentUser);
      if (currentUser) return;
      type UpsertUserResponse = {
        data: {
          upsertUser: User;
        };
      };

      const { data: myData } = await axiosClient<UpsertUserResponse>(
        UPSERT_USER,
        data?.accessToken
      );

      setUser(myData.upsertUser);
    };
    void getUser();
  }, [data?.accessToken]);
  if (!user) return null;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
