import { createServerFn } from '@tanstack/react-start'
import { getModels } from '@tokenlens/models'

export const getAvailableModels = createServerFn({
  method: 'GET',
}).handler(async () => {
  const models = getModels()
  return [
    { ...models.openai.models['gpt-5'], provider: 'openai' },
    { ...models.openai.models['gpt-5-mini'], provider: 'openai' },
    { ...models.openai.models['gpt-5-nano'], provider: 'openai' },
    { ...models.openai.models['gpt-4.1'], provider: 'openai' },
    { ...models.openai.models['gpt-4.1-mini'], provider: 'openai' },
    { ...models.openai.models['o4-mini'], provider: 'openai' },
    { ...models.openai.models['o3'], provider: 'openai' },
    {
      ...models.anthropic.models['claude-sonnet-4-20250514'],
      provider: 'anthropic',
    },
    {
      ...models.anthropic.models['claude-3-7-sonnet-20250219'],
      provider: 'anthropic',
    },
    { ...models.google.models['gemini-2.5-pro'], provider: 'google' },
    { ...models.google.models['gemini-2.5-flash'], provider: 'google' },
    {
      ...models.google.models['gemini-2.5-flash-lite-preview-06-17'],
      provider: 'google',
    },
  ]
})
