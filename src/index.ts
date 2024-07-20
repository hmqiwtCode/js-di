//import "reflect-metadata";

function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Arguments for ${propertyKey}: ${args}`);
    return originalMethod.apply(this, args);
  };
}

class Example {
  @Log
  greet(message: string, event: string) {
    console.log(`Hello, ${message}`);
  }
}

const example = new Example();
example.greet("World", "call"); // Logs: Arguments for greet: [ 'World' ]
// Logs: Hello, World
