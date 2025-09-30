import { Provider } from '@/lib/models'
import { SiAnthropic, SiOpenai } from '@icons-pack/react-simple-icons'

export function LogoDisplay({ provider }: { provider: Provider }) {
  switch (provider) {
    case 'openai':
      return <SiOpenai />
    case 'anthropic':
      return <SiAnthropic />
    default:
      return null
  }
}
