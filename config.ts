// where the fuck the uuidv4 at man
import { randomUUIDv7 } from "bun";

export const CONFIG = {
  PORT: Bun.env.PORT ?? 3001,
  UPLOAD_TOKEN:
    Bun.env.UPLOAD_TOKEN ?? (await Bun.password.hash(randomUUIDv7())), // literally idk
  LOG_UPLOADS: Bun.env.LOG_UPLOADS === "true",
  LOG_IPBANS: Bun.env.LOG_IPBANS === "true",
  UPLOAD_FOLDER:
    Bun.env.UPLOAD_FOLDER ??
    // USERPROFILE is defined in win, HOME for *nix, all else fails then cry and save randomly
    (Bun.env.USERPROFILE || Bun.env.HOME || "") + "/" + "Desktop",
} as const;
