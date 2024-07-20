import { container } from "./di-container";

export function injectable<T>() {
  return function (constructor: any) {
    container.register(constructor, () => {
      /**
       *  Reflect on the parameter types of class constructors or methods.
       *  e.g constructor(public logger: Logger) {}  => paramType = [class Logger]
       *   class Logger {
       *         log(message) {
       *             console.log("Log:", message);
       *         }
       *     }
       *
       */
      const paramTypes: any[] =
        Reflect.getMetadata("design:paramtypes", constructor) || [];
      const paramInstances = paramTypes.map((param: any) => {
        return container.resolve(param);
      });
      return new constructor(...paramInstances);
    });
  };
}
