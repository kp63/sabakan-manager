export default interface Config {
  panelName?: string;
  app: {
    rootDir: string;
    configFilePath: string;
  }
  features: {
    sendCommand: boolean;
  }
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
