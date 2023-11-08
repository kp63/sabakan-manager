import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { ServerInfoErrorResponse, ServerInfoResponse } from "@/pages/api/info";

const useServerInfo = () => {
  const { data, error, ...etc } = useSWR<ServerInfoResponse, ServerInfoErrorResponse>('/api/info', fetcher);

  return {
    isLoaded: data && !error,
    data,
    error,
    ...etc,
  }
}

export default useServerInfo;
