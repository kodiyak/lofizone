export class PluginContext<State = any> {
  private static instances: Record<string, PluginContext> = {};

  private constructor(
    public readonly pluginId: string,
    private state: State,
  ) {}

  public static create<State, T extends PluginContext<State>>(
    pluginId: string,
    state: State,
  ): T {
    if (!this.instances[pluginId]) {
      this.instances[pluginId] = new PluginContext(pluginId, state) as T;
    }
    return this.instances[pluginId] as T;
  }

  public getState(): State {
    return this.state;
  }

  public setState(newState: State): void {
    this.state = newState;
  }
}

export namespace PluginContext {
  export interface InstanceProps<State = any> {
    state: State;
  }
}
