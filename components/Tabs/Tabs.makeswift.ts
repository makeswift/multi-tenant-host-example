import { lazy } from 'react'

import { Group, List, Slot, Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./tabs').then(({ MSTabs }) => ({ default: MSTabs }))),
  {
    type: 'storefront-kit-tabs',
    label: 'Custom / Tabs',
    icon: 'tabs',
    props: {
      className: Style(),
      defaultValue: TextInput({ label: 'Default tab value', defaultValue: 'tab-1' }),
      tabs: List({
        label: 'Tabs',
        type: Group({
          label: 'Tab',
          props: {
            value: TextInput({ label: 'Value' }),
            label: TextInput({ label: 'Label', defaultValue: 'Tab' }),
            content: Slot(),
          },
        }),
        getItemLabel(item) {
          return item?.label ?? 'Tab'
        },
      }),
    },
  }
)
