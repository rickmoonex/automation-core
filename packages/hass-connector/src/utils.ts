import { EVENT_TYPE_STATE_CHANGED, STATE_ON, STATE_OFF } from './const';
import * as ha from 'home-assistant-js-websocket';

export function isStateChangedEvent({
  eventData,
}: {
  eventData: ha.HassEvent;
}) {
  return (
    eventData.event_type && eventData.event_type === EVENT_TYPE_STATE_CHANGED
  );
}

export function entityTurnedOff({
  eventData,
  entityId = false,
}: {
  eventData: ha.HassEvent;
  entityId: string | boolean;
}) {
  if (
    isStateChangedEvent({ eventData }) &&
    eventData.data['new_state'].state === STATE_OFF &&
    eventData.data['old_state'].state !== STATE_OFF
  ) {
    if (!entityId || eventData.data['entity_id'] === entityId) {
      return true;
    }
  }
  return false;
}

export function entityTurnedOn({
  eventData,
  entityId = false,
}: {
  eventData: ha.HassEvent;
  entityId: string | boolean;
}) {
  if (
    isStateChangedEvent({ eventData }) &&
    eventData.data['new_state'].state === STATE_ON &&
    eventData.data['old_state'].state !== STATE_ON
  ) {
    if (!entityId || eventData.data['entity_id'] === entityId) {
      return true;
    }
  }
  return false;
}
