import { createIsomorphicFn } from '@tanstack/react-start'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AI_GATEWAY_API_KEY: z.string(),
  TAVILY_API_KEY: z.string(),
})

const clientEnvSchema = z.object({})

const getEnv = createIsomorphicFn()
  .server(() => envSchema.parse(process.env))
  .client(() => clientEnvSchema.parse(import.meta.env))

export const env = getEnv()
