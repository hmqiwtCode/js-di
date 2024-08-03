// Define an interface for the test structure
interface Test1 {
  name: string;
  testFunc: () => void;
}

// Simple Test Framework class
class SimpleTestFramework {
  private tests: Test1[] = [];

  public addTest(name: string, testFunc: () => void): void {
    this.tests.push({ name, testFunc });
  }

  public run(): void {
    this.tests.forEach(({ name, testFunc }) => {
      try {
        testFunc();
        console.log(`${name}: PASS`);
      } catch (error) {
        console.log(`${name}: FAIL - ${(error as Error).message}`);
      }
    });
  }
}

const testFramework = new SimpleTestFramework();

// Define an interface for objects with any methods
interface AnyObject {
  [methodName: string]: any;
}

// Simple Stub class for method stubbing
class SimpleStub {
  private originalMethod: Function;

  constructor(private obj: AnyObject, private methodName: string) {
    this.originalMethod = obj[methodName];
  }

  public callThrough(): this {
    this.obj[this.methodName] = this.originalMethod.bind(this.obj);
    return this;
  }

  public withArgs(...expectedArgs: any[]): this {
    const originalMethod = this.originalMethod;
    this.obj[this.methodName] = (...args: any[]): any => {
      if (JSON.stringify(args) === JSON.stringify(expectedArgs)) {
        return { result: 9000 };
      }
      return originalMethod.apply(this.obj, args);
    };
    return this;
  }

  public restore(): void {
    this.obj[this.methodName] = this.originalMethod;
  }
}

function stub1(obj: AnyObject, methodName: string): SimpleStub {
  return new SimpleStub(obj, methodName);
}

// Example class to test
class Obj {
  public result: number = 0;

  public sum(a: number, b: number): number {
    return a + b;
  }
}

const obj = new Obj();

// Adding Tests
testFramework.addTest(
  "Test regular method with stubbing specific arguments",
  () => {
    const stub = stub1(obj, "sum");
    stub.withArgs(1, 2); // Stubbing to return a specific result for arguments (1, 2)
    const result1 = obj.sum(2, 3); // Should call original method and return 5
    const result2 = obj.sum(1, 2) as unknown as { result: number }; // Should return stubbed result { result: 9000 }
    console.log("result1", result1);
    console.log("result2", result2);
    if (result1 !== 5) throw new Error(`Expected 5, got ${result1}`);
    if (result2.result !== 9000)
      throw new Error(`Expected 9000, got ${result2.result}`);
    // stub.restore(); // Restore after test
  }
);

testFramework.run();
