import { CONFIG } from "./config";

export class Logger {
  constructor(public name: string) {
    this.log = this.log.bind(this);
  }

  log(...data: any[]) {
    console.log(`[${this.name}] ${new Date().toISOString()}:`, ...data);
  }

  log_prefix(prefix: string, ...data: any[]) {
    this.log(`::${prefix}:`, ...data);
  }

  log_upload(...data: any[]) {
    if (CONFIG.LOG_UPLOADS) this.log_prefix("upload", ...data);
  }

  log_text(...data: any[]) {
    if (CONFIG.LOG_UPLOADS) this.log_prefix("text", ...data);
  }
}
