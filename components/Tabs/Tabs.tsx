import type { ReactNode } from 'react'

import { Tabs } from 'storefront-kit'

import { MSEmptyState } from '../empty-state/empty-state'

interface MSTab {
  value?: string
  label: string
  content: ReactNode
}

interface MSTabsProps {
  className?: string
  defaultValue?: string
  tabs?: MSTab[]
}

export function MSTabs({ className, defaultValue, tabs = [] }: MSTabsProps) {
  if (tabs.length === 0) {
    return <MSEmptyState className={className}>No tabs to display</MSEmptyState>
  }

  const resolvedTabs = tabs.map((tab, index) => ({
    value: tab.value ?? `tab-${index + 1}`,
    label: tab.label,
    content: tab.content,
  }))

  return (
    <Tabs
      className={className}
      defaultValue={defaultValue ?? resolvedTabs[0].value}
      tabs={resolvedTabs}
    />
  )
}
