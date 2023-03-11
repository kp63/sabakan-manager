export const dockerInspectStateStatuses = ["created", "restarting", "running", "removing", "paused", "exited", "dead"] as const;
export const dockerInspectHealthStatuses = ["starting", "healthy", "unhealthy"] as const;
export type DockerInspectStateStatuses = typeof dockerInspectStateStatuses[number];
export type DockerInspectHealthStatuses = typeof dockerInspectHealthStatuses[number];
export const isDockerInspectStateStatuses = (payload: unknown): payload is DockerInspectStateStatuses =>
  typeof payload === "string" && (dockerInspectStateStatuses as any as string[]).includes(payload);
export const isDockerInspectHealthStatuses = (payload: unknown): payload is DockerInspectHealthStatuses =>
  typeof payload === "string" && (dockerInspectHealthStatuses as any as string[]).includes(payload);

export const dockerInspectStateStatusColors: { [key in DockerInspectStateStatuses]: string } = {
  created: "#0db7ed",
  restarting: "#edae0d",
  running: "#31c48d",
  removing: "#ef5050",
  paused: "#646464",
  exited: "#ef5050",
  dead: "#6c2525"
}

export const dockerInspectHealthStatusColors: { [key in DockerInspectHealthStatuses]: string } = {
  starting: "#edae0d",
  healthy: "#31c48d",
  unhealthy: "#ef5050",
}
