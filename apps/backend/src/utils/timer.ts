class Timer {
  private _start: number;
  private _end: number;

  constructor() {
    this._start = Date.now();
    this._end = 0;
  }

  time(): number {
    return this._end === 0 ? Date.now() - this._start : this._end - this._start;
  }

  start() {
    this._start = Date.now();
    return this;
  }

  end() {
    this._end = Date.now();
    return this;
  }

  stop() {
    this._start = 0;
    this._end = 0;
    return this;
  }

  async exec(name: string, callback: () => Promise<void> | void): Promise<void> {
    this.start();
    console.log(`[timer][${name}] Started`);
    return Promise.resolve(callback()).finally(() => {
      this.end();
      console.log(`[timer][${name}] ${this.time()}ms`);
    });
  }
}

export function createTimer() {
  return new Timer();
}
