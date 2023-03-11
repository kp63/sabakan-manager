export default interface Config {
  panelName?: string;
  server: {
    type: 'docker' //| 'screen' | 'systemd'
    basePath: string;
    dataPath: string;
    serviceName: string;
    host: string;
    port: number;
    rconPassword: string;
    rconPort: number;
  }
  login: [string, string];
  dockerPath: string;
}
