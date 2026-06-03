import { CONFIG } from "./config";

export class Logger {
  constructor(public name: string) {
    this.log = this.log.bind(this);
  }

  log(...data: any[]) {
    console.log(`[${this.name}] ${new Date().toISOString()}:`, ...data);
  }

  log_upload(...data: any[]) {
    if (CONFIG.LOG_UPLOADS) this.log(`::upload: `, ...data);
  }
}
