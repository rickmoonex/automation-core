import * as ha from 'home-assistant-js-websocket';
import { HassConfig } from '..';

class HassConnector {
  private _config: HassConfig;
  conn!: ha.Connection;

  constructor(config: HassConfig) {
    this._config = config;
  }

  async connect() {
    const auth = ha.createLongLivedTokenAuth(
      this._config.url,
      this._config.accessToken
    );

    this.conn = await ha.createConnection({ auth });
  }
}

export default HassConnector;
