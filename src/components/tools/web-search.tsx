'use client'

import { useControllableState } from '@radix-ui/react-use-controllable-state'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { SearchIcon, ChevronDownIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { createContext, memo, useContext } from 'react'

type SearchResult = {
  title: string
  url: string
  content?: string
  score?: number
}

type WebSearchContextValue = {
  isSearching: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  resultsCount: number
}

const WebSearchContext = createContext<WebSearchContextValue | null>(null)

const useWebSearch = () => {
  const context = useContext(WebSearchContext)
  if (!context) {
    throw new Error('WebSearch components must be used within WebSearch')
  }
  return context
}

export type WebSearchProps = ComponentProps<typeof Collapsible> & {
  isSearching?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  resultsCount?: number
}

export const WebSearch = memo(
  ({
    className,
    isSearching = false,
    open,
    defaultOpen = false,
    onOpenChange,
    resultsCount = 0,
    children,
    ...props
  }: WebSearchProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen)
    }

    return (
      <WebSearchContext.Provider
        value={{ isSearching, isOpen, setIsOpen, resultsCount }}
      >
        <Collapsible
          className={cn('not-prose mb-4', className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </WebSearchContext.Provider>
    )
  }
)

export type WebSearchTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  query?: string
}

export const WebSearchTrigger = memo(
  ({ className, query, children, ...props }: WebSearchTriggerProps) => {
    const { isSearching, isOpen, resultsCount } = useWebSearch()

    return (
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground',
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <SearchIcon className="size-4" />
            {isSearching ? (
              <span>Searching{query && `: ${query}`}</span>
            ) : (
              <span>
                Found {resultsCount}{' '}
                {resultsCount === 1 ? 'resource' : 'resources'}
              </span>
            )}
            <ChevronDownIcon
              className={cn(
                'size-4 transition-transform',
                isOpen ? 'rotate-180' : 'rotate-0'
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    )
  }
)

export type WebSearchContentProps = Omit<
  ComponentProps<typeof CollapsibleContent>,
  'results'
> & {
  results: SearchResult[]
}

const SearchResultItem = memo(({ result }: { result: SearchResult }) => {
  const hostname = new URL(result.url).hostname
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-accent/50"
    >
      <img
        src={faviconUrl}
        alt=""
        className="size-5 shrink-0 mt-0.5 rounded-sm"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-foreground text-sm truncate group-hover:underline">
            {result.title}
          </span>
          <span className="text-muted-foreground/60 text-xs shrink-0">
            {hostname}
          </span>
        </div>
        {result.content && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed mt-1">
            {result.content}
          </p>
        )}
      </div>
    </a>
  )
})

SearchResultItem.displayName = 'SearchResultItem'

export const WebSearchContent = memo(
  ({ className, results, ...props }: WebSearchContentProps) => (
    <CollapsibleContent
      className={cn(
        'mt-3 text-sm',
        'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      {...props}
    >
      <div className="flex flex-col">
        {results.map((result, index) => (
          <SearchResultItem key={`${result.url}-${index}`} result={result} />
        ))}
      </div>
    </CollapsibleContent>
  )
)

WebSearch.displayName = 'WebSearch'
WebSearchTrigger.displayName = 'WebSearchTrigger'
WebSearchContent.displayName = 'WebSearchContent'
