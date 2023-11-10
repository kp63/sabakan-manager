import useSWR from "swr";
import { ServerConfigResponse } from "@/pages/api/app-config";

const useConfig = () => {
  const { data, error, ...etc } = useSWR<ServerConfigResponse>('/api/app-config');

  return {
    isLoaded: data && !error,
    config: data,
    error,
    ...etc,
  }
}

export default useConfig;
