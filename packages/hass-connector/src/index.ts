import HassConnector from './lib/HassConnector';
import * as ha from 'home-assistant-js-websocket';

type HassConfig = {
  url: string;
  accessToken: string;
};

class HomeAssistantService {
  private _hass: HassConnector;
  private _connected: boolean;
  private _entitiesCollection!: ha.Collection<ha.HassEntities>;
  private _eventCallback: (event: ha.HassEvent) => void;

  constructor(
    eventCallback: (event: ha.HassEvent) => void,
    config: HassConfig
  ) {
    const hassConfig: HassConfig = {
      url: config.url,
      accessToken: config.accessToken,
    };

    this._hass = new HassConnector(hassConfig);
    this._connected = false;
    this._eventCallback = eventCallback;
    this.init();
  }

  async connect() {
    try {
      console.info('Connecting to Home Assistant');
      await this._hass.connect();
      this._connected = true;
      console.info('Connected to Home Assistant');
    } catch (e) {
      console.error('There was an error connecting to Home Assistant', e);
      this._connected = false;
    }
  }

  async init() {
    try {
      await this.connect();
    } catch (e) {
      console.error(e);
    }

    this._hass.conn.subscribeEvents((e: ha.HassEvent) => {
      console.info('=== HOMEASSISTANT EVENT ===');
      console.info(JSON.stringify(e, null, 2));
      console.info('=== END HOMEASSISTANT EVENT ===');
      this._eventCallback(e);
    });

    this._entitiesCollection = ha.entitiesColl(this._hass.conn);
    await this._entitiesCollection.refresh();
  }

  getState(entityId: string) {
    if (!this._connected) {
      throw new Error('not connected to hass');
    }

    return this._entitiesCollection.state[entityId];
  }

  setEventCallback(eventCallback: (event: ha.HassEvent) => void) {
    this._eventCallback = eventCallback;
  }

  callService({
    domain,
    service,
    serviceData,
  }: {
    domain: string;
    service: string;
    serviceData: Record<string, unknown>;
  }) {
    if (!this._connected) {
      throw new Error('not connected to hass');
    }

    console.info('calling service', domain, service, serviceData);
    return ha.callService(this._hass.conn, domain, service, serviceData);
  }
}

export { HomeAssistantService, HassConfig };
export * from './const';
export * from './utils';
