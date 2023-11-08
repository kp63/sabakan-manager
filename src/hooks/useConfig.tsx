import useSWR from "swr";
import { ServerPingResponse } from "@/pages/api/ping";

const useConfig = () => {
  const { data, error, ...etc } = useSWR<ServerPingResponse>('/api/get-config');

  return {
    isLoaded: data && !error,
    config: data,
    error,
    ...etc,
  }
}

export default useConfig;
