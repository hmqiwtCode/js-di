import { injectable } from "./injectable";
import { container } from "./di-container";

@injectable()
class Logger {
  log(message: string) {
    console.log("Log:", message);
  }
}

@injectable()
class App {
  constructor(public logger: Logger) {}

  run() {
    this.logger.log("Application is running");
  }
}

const app = container.resolve(App);
app.run();
