import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export type ModelId = string

export const LOCAL_STORAGE_SELECTED_MODEL_KEY = 'selectedModel'

export const modelAtom = atomWithStorage<ModelId>(
  LOCAL_STORAGE_SELECTED_MODEL_KEY,
  '',
  createJSONStorage(() => localStorage),
  { getOnInit: true }
)
