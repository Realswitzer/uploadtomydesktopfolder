// where the fuck the uuidv4 at man
import { randomUUIDv7 } from "bun";

export const CONFIG = {
  PORT: Bun.env.PORT ?? 3001,
  UPLOAD_TOKEN:
    Bun.env.UPLOAD_TOKEN ?? (await Bun.password.hash(randomUUIDv7())), // literally idk
} as const;
