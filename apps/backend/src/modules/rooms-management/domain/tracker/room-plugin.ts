import { EventEmitter } from '@/shared/infra/event-emitter';
import { RoomPluginEvents } from '@workspace/core';

export interface RoomPluginProps {
  id: string;
  name: string;
  state: any | null;
  settings: any;
  installedAt: Date;
  roomId: string;
}

export class RoomPlugin {
  public readonly events = new EventEmitter(RoomPluginEvents, 'RoomPlugin');

  private readonly _id: string;
  private readonly _name: string;
  private _settings: any;
  private _state: any;
  private readonly _installedAt: Date;
  private readonly _roomId: string;

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get settings() {
    return this._settings;
  }

  get state() {
    return this._state;
  }

  get installedAt() {
    return this._installedAt;
  }

  get roomId() {
    return this._roomId;
  }

  constructor(props: RoomPluginProps) {
    this._id = props.id;
    this._name = props.name;
    this._settings = props.settings;
    this._state = props.state;
    this._installedAt = props.installedAt;
    this._roomId = props.roomId;
  }

  static create(props: RoomPluginProps) {
    return new RoomPlugin(props);
  }

  install() {
    this.events.emit('plugin_installed', {
      roomId: this.roomId,
    });
    this.start();
  }

  uninstall() {
    this.stop();
    this.events.emit('plugin_uninstalled', {
      roomId: this.roomId,
    });
  }

  start() {
    this.events.emit('plugin_started', {
      roomId: this.roomId,
      name: this.name,
      settings: this.settings,
      state: this.state,
    });
  }

  stop() {
    this.events.emit('plugin_stopped', {
      roomId: this.roomId,
    });
  }

  updateSettings(settings: any) {
    this._settings = settings;
    this.events.emit('plugin_settings_updated', {
      roomId: this.roomId,
      settings: this._settings,
    });
  }
}
