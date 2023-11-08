import useSWR from "swr";
import { ServerPingResponse } from "@/pages/api/ping";
import fetcher from "@/utils/fetcher";

const usePing = () => {
  const { data, error, ...etc } = useSWR<ServerPingResponse>('/api/ping', fetcher, {
    refreshInterval: (data) => data?.isOnline ? 2000 : 1000
  });

  return {
    isLoaded: data && !error,
    data,
    error,
    ...etc,
  }
}

export default usePing;
