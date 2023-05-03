import axios from "axios";

const axiosClient = async <T>(
  query: string,
  accessToken: string,
  variables?: { [key: string]: unknown }
) => {
  type Data = {
    data: T;
  };
  const { data } = await axios.post<Data>(
    "http://localhost:4000",
    {
      query,
      variables,
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.data;
};
export default axiosClient;
