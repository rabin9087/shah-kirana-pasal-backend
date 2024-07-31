import { z } from "zod";

export const envVariables = z.object({
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
  GMAIL_USER: z.string(),
  WEB_DOMAIN: z.string(),
  BUCKET_NAME: z.string(),
  REGION: z.string(),
  ACCESS_KEY: z.string(),
  SECRET_KEY: z.string(),
});

