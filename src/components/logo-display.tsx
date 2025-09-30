import { SiAnthropic, SiGoogle, SiOpenai } from '@icons-pack/react-simple-icons'

export function LogoDisplay({ provider }: { provider: string }) {
  switch (provider) {
    case 'openai':
      return <SiOpenai />
    case 'anthropic':
      return <SiAnthropic />
    case 'google':
      return <SiGoogle />
    default:
      return null
  }
}
