import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
  private instances = new Map<Constructor, any>();
  private factories = new Map<Constructor, () => any>();

  register<T>(token: Constructor<T>, factory: () => T) {
    this.factories.set(token, factory);
  }

  resolve<T>(token: Constructor<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Factory not registered for: ${token.name}`);
    }

    const instance = factory();
    this.instances.set(token, instance);
    return instance;
  }
}

export const container = new DIContainer();
