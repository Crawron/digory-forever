import { readFile } from "fs/promises"
import path from "path"
import { parse as parseYaml } from "yaml"
import { z } from "zod"
import { env } from "./env"

const configSchema = z.object({
	mirrorDestination: z.string().optional(),
	mirrorSources: z.string().array().optional().default([]),
	announcementTargets: z.string().array().optional().default([]),
	emojiMap: z.record(z.string(), z.string()).optional(),
	avatarTargets: z.string().array().optional().default([]),
})

// todo: create config file if doesn't exist

const configFile = await readFile(
	path.join(env.DATA_DIR, "config.yaml"), // maybe take .yml too? but no big deal
	"utf-8"
)

export const config = configSchema.parse(parseYaml(configFile))
