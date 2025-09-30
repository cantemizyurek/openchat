// import { env } from '@/config/env'
import { createServerFn } from '@tanstack/react-start'
import { gateway } from '@ai-sdk/gateway'
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

// const MODEL_AGE_THRESHOLD = new Date('2025-01-01')
// const MODEL_COST_THRESHOLD = {
//   input: 10,
//   output: 30,
// }

// interface Model {
//   release_date: string
//   cost?: {
//     input: number
//     output: number
//   }
// }

// export type Provider = ReturnType<typeof getModels>[keyof ReturnType<
//   typeof getModels
// >]['id']

// export const getAvailableModels = createServerFn({
//   method: 'GET',
// }).handler(async () => {
//   const providers = Object.keys(getModels())

//   const models = providers.flatMap((providerString) => {
//     const provider =
//       getModels()[providerString as keyof ReturnType<typeof getModels>]

//     if (!checkIsInEnv(provider)) {
//       return []
//     }

//     const providerModels = Object.entries(provider.models).sort(
//       ([, a], [, b]) =>
//         new Date((b as Model).release_date).getTime() -
//         new Date((a as Model).release_date).getTime()
//     )
//     const models = []
//     for (const [modelKey, model] of providerModels) {
//       if (
//         new Date(model.release_date) > MODEL_AGE_THRESHOLD &&
//         model.cost &&
//         model.cost.input < MODEL_COST_THRESHOLD.input &&
//         model.cost.output < MODEL_COST_THRESHOLD.output
//       ) {
//         models.push({
//           provider: providerString,
//           model: modelKey,
//           name: model.name,
//         })
//       }
//     }
//     return models
//   })

//   return models
// })

// function checkIsInEnv(
//   provider: ReturnType<typeof getModels>[keyof ReturnType<typeof getModels>]
// ) {
//   return provider.env.every((envVariable) => envVariable in env)
// }
