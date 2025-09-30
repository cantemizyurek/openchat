import { modelAtom } from '@/lib/state/model'
import { useAtom } from 'jotai/react'
import {
  PromptInputModelSelect,
  PromptInputModelSelectItem,
  PromptInputModelSelectContent,
  PromptInputModelSelectValue,
  PromptInputModelSelectTrigger,
} from './ai-elements/prompt-input'
import { getAvailableModels, Provider } from '@/lib/models'
import { useQuery } from '@tanstack/react-query'
import { createClientOnlyFn } from '@tanstack/react-start'
import { LogoDisplay } from './logo-display'

const getModel = createClientOnlyFn(() => {
  const [model, setModel] = useAtom(modelAtom)
  return { model, setModel }
})

export function ModelSelector() {
  const { model, setModel } = getModel()
  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: getAvailableModels,
  })

  console.log(models)

  return (
    <PromptInputModelSelect
      onValueChange={(value) => {
        setModel(value)
      }}
      value={model}
    >
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {models?.map((model) => (
          <PromptInputModelSelectItem
            key={model.model}
            value={`${model.provider}:${model.model}`}
          >
            <LogoDisplay provider={model.provider as Provider} />
            <span>{model.name}</span>
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  )
}
