import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PB: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
