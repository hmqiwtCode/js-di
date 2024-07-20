import "reflect-metadata";

class SimpleContainer {
  private registrations = new Map();
  private singletons = new Map();

  register(classFn, { singleton = false } = {}) {
    const params = Reflect.getMetadata("design:paramtypes", classFn) || [];
    this.registrations.set(classFn, { params, singleton });
  }

  resolve(classFn) {
    if (this.singletons.has(classFn)) {
      return this.singletons.get(classFn);
    }

    const registration = this.registrations.get(classFn);
    if (!registration) {
      throw new Error(`No registration for class: ${classFn.name}`);
    }

    const resolvedParams = registration.params.map((param) =>
      this.resolve(param)
    );
    const instance = new classFn(...resolvedParams);

    if (registration.singleton) {
      this.singletons.set(classFn, instance);
    }

    return instance;
  }
}

function injectable({ singleton = false } = {}) {
  return function (constructor) {
    mySimpleContainer.register(constructor, { singleton });
  };
}

// Set up our own simple container
const mySimpleContainer = new SimpleContainer();

// Define classes with our custom @injectable decorator
@injectable({ singleton: true })
class Logger {
  log(message) {
    console.log(message);
  }
}

@injectable()
class Service {
  constructor(public logger: Logger) {}
  execute() {
    this.logger.log("Service is executing...");
  }
}

@injectable()
class Controller {
  constructor(public service: Service) {}
  handleRequest() {
    this.service.execute();
  }
}

// Resolve 'Controller' using our simplified container
const controllerInstance = mySimpleContainer.resolve(Controller);
controllerInstance.handleRequest();
