import { lazy } from 'react'

import { Group, List, Select, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./accordion').then(({ MSAccordion }) => ({ default: MSAccordion }))),
  {
    type: 'storefront-kit-accordion',
    label: 'Custom / Accordion',
    icon: 'accordion',
    props: {
      className: Style(),
      type: Select({
        label: 'Selection type',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'multiple', label: 'Multiple' },
        ],
        defaultValue: 'multiple',
      }),
      items: List({
        label: 'Items',
        type: Group({
          label: 'Accordion item',
          props: {
            title: TextInput({ label: 'Title', defaultValue: 'Accordion item title' }),
            content: TextInput({ label: 'Content', defaultValue: 'Accordion item content' }),
          },
        }),
        getItemLabel(item) {
          return item?.title ?? 'Accordion item'
        },
      }),
    },
  }
)
