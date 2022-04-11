import { hassConnector } from './hass-connector';

describe('hassConnector', () => {
  it('should work', () => {
    expect(hassConnector()).toEqual('hass-connector');
  });
});
