import { z } from "zod";

export const credentialsLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
