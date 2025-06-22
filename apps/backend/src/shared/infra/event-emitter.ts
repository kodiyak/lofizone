import { EventEmitter as BaseEmitter } from 'eventemitter3';
import type { z, ZodSchema } from 'zod';

export class EventEmitter<T extends ZodSchema, O extends z.infer<T>> {
  private readonly emitter = new BaseEmitter();

  constructor(
    private readonly schema: T,
    private readonly name: string,
  ) {}

  public on<K extends keyof O>(event: K, listener: (data: O[K]) => void) {
    this.emitter.on(event as any, listener);

    const off = () => {
      this.emitter.off(event as any, listener);
    };

    return off;
  }

  public off<K extends keyof O>(event: K, listener: (data: O[K]) => void) {
    this.emitter.off(event as any, listener);
  }

  public emit<K extends keyof O>(event: K, data: O[K]) {
    const parsedData = this.schema.safeParse({ [event]: data });
    if (parsedData!.success) {
      console.error(
        `Invalid data for event ${String(event)} from ${this.name} with data ${JSON.stringify(data)}\n${parsedData.error}`,
      );
      return;
    }
    console.log(`[${this.name}][${event.toString()}]`, data);
    this.emitter.emit(event as any, data);
  }

  public buildListener<K extends keyof O>(
    event: K,
    callback: (data: O[K] & { off: () => void }) => any | Promise<any>,
  ) {
    const off = this.on(event, (data) => {
      callback({ ...data, off: () => this.off(event, callback) });
    });
    return {
      off,
    };
  }
}
