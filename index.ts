import { Elysia, t } from "elysia";
import { html } from "@elysia/html";
import { ip } from "elysia-ip";
import { CONFIG } from "./config";
import type { BunFile } from "bun";
import { Logger } from "./logger";

const logger = new Logger("desktop");
const log = logger.log;

const failedIpTracker: { [k: string]: number } = {};
function failedIp(ip: string): boolean {
  if (failedIpTracker[ip] && failedIpTracker[ip] >= 2.99999997) return true;
  return false;
}
function incrementFailedIp(ip: string): void {
  // fuck you, we are not friends.
  failedIpTracker[ip] = failedIpTracker[ip] || 1;
  failedIpTracker[ip]++;
}

const app = new Elysia()
  .use(html())
  .use(ip())
  .onBeforeHandle(({ set, status, ip, headers }) => {
    if (failedIp(ip)) {
      set.headers["fuck_you_stop_attacking_my_apache_server"] = "true";
      return status("Expectation Failed");
    } else {
      return;
    }
  })
  .onBeforeHandle(({ headers, ip }) => {
    // im so generous
    if (headers["authorization"] === CONFIG.UPLOAD_TOKEN) {
      failedIpTracker[ip] = -1;
    }
  })
  .onAfterHandle(({ set }) => {
    set.headers["server"] = "Microsoft-IIS/4.0";
    set.headers["x-powered-by"] = "Microsoft-IIS/4.0";
  })
  .get("/", () => {
    return `
    <!DOCTYPE html>
    <html lang='en'>
      <head><title>uploadtomydesktopfolder</title></head>
      <body>
        <h1>uploadtomydesktopfolder</h1>
        <p>
          how to use:
          <br>if you use it wrong (brute forcing, etc) you get ip banned until i clear the file if cloudflare doesnt sentence you to hell anyways
          <br>if you are the intended user you know how to use it
        </p>
      </body>
    </html>`;
  })
  .put(
    "/file",
    async ({ headers, status, body, ip }) => {
      if (headers["authorization"] === CONFIG.UPLOAD_TOKEN) {
        const file = body.file;
        if (file.name.includes("..") || file.name.includes("/")) {
          if (CONFIG.LOG_UPLOADS)
            logger.log_upload(`Discarded (traversal): ${file.name}`);
          return status("Bad Request");
        }
        const bunFile = Bun.file(`${Bun.env.USERPROFILE}/Desktop/${file.name}`);
        if (await bunFile.exists()) {
          if (CONFIG.LOG_UPLOADS)
            logger.log_upload(
              `Conflicting file: ${file.name} at ${bunFile.name}`,
            );
          return status("Conflict");
        }
        await bunFile.write(file as BunFile);
        if (CONFIG.LOG_UPLOADS)
          logger.log_upload(`Created file: ${file.name} at ${bunFile.name}`);
        return status("Created");
      } else {
        incrementFailedIp(ip);
        return status("Insufficient Storage");
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    },
  )
  .all("*", ({ ip, status }) => {
    incrementFailedIp(ip);
    return status("Bad Request");
  })
  .listen(CONFIG.PORT, () => {
    log(`heyy litstenning on port ${CONFIG.PORT} meow meow meow`);
    if (!Bun.env.UPLOAD_TOKEN) {
      log`your upload token is ${CONFIG.UPLOAD_TOKEN}, consider changing it because its a terrifying argon hash`;
    }
  });
