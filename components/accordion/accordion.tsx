import { Accordion } from 'storefront-kit'

import { MSEmptyState } from '../empty-state/empty-state'

interface MSAccordionItem {
  title: string
  content: string
}

interface MSAccordionProps {
  className?: string
  type: 'single' | 'multiple'
  items: MSAccordionItem[]
}

export function MSAccordion({ className, type, items }: MSAccordionProps) {
  if (items.length === 0) {
    return <MSEmptyState className={className}>No accordion items to display</MSEmptyState>
  }

  return (
    <Accordion
      className={className}
      collapsible={type === 'single' ? true : undefined}
      items={items.map(({ title, content }, index) => ({
        title,
        content,
        value: index.toString(),
      }))}
      type={type}
    />
  )
}
