import { InferUITool, tool } from 'ai'
import z from 'zod'
import { tavily as tavilyClient } from '@tavily/core'
import { env } from '@/config/env'

const tavily = tavilyClient({
  apiKey: env.TAVILY_API_KEY,
})

export const webSearchTool = tool({
  name: 'web_search',
  description: 'Search the web for information',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }: { query: string }) => {
    const results = await tavily.search(query, {
      autoParameters: true,
    })
    return results
  },
})

export type WebSearchUITool = InferUITool<typeof webSearchTool>

export const tools = {
  webSearch: webSearchTool,
} as const
