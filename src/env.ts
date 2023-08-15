import "dotenv/config"

import { z } from "zod"

export const env = z
	.object({
		DATA_DIR: z.string(),
		DISCORD_BOT_TOKEN: z.string(),
		DISCORD_SERVER_ID: z.string(),
		/* REDIS_URL: z.string(), */
	})
	.parse(process.env)
