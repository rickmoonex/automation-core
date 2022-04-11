type TimeServiceOptions = {
  frequency?: number;
};

class TimeService {
  private _eventCallback: () => void;
  private _frequency: number;

  constructor(eventCallback: () => void, options: TimeServiceOptions) {
    this._eventCallback = eventCallback;
    this._frequency = options.frequency || 1000;
    this.init();
  }

  init() {
    setInterval(() => {
      this._eventCallback();
    }, this._frequency);
  }

  setEventCallback(eventCallback: () => void) {
    this._eventCallback = eventCallback;
  }
}

export default TimeService;
