import { useState, useEffect } from "react";
import axiosClient from "~/lib/axiosClient";

const useAxiosClient = <AxiosClientResponse>(
  accessToken: string | undefined,
  query: string,
  key: string,
  variables?: { [key: string]: unknown }
) => {
  type HookResponse = {
    data: AxiosClientResponse | null;
    loading: boolean;
    error: string | null;
  };
  const [data, setData] = useState<HookResponse>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const getData = async () => {
      if (!accessToken) return;

      type DirectResponse = {
        [key: string]: AxiosClientResponse;
      };
      const response = await axiosClient<DirectResponse>(
        query,
        accessToken,
        variables
      );
      const responseData = response as AxiosClientResponse;
      setData({
        data: responseData,
        loading: false,
        error: null,
      });
    };
    void getData();
  }, [accessToken, key, variables, query]);
  return data;
};

export default useAxiosClient;
