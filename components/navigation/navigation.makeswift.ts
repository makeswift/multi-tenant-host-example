import { lazy } from 'react'

import {
  Color,
  Group,
  Image,
  Link,
  List,
  Number,
  Style,
  TextInput,
} from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./navigation').then(({ Navigation }) => ({ default: Navigation }))),
  {
    type: 'custom-navigation',
    label: 'Custom / Navigation',
    icon: 'navigation',
    props: {
      className: Style({ properties: [Style.Margin] }),
      backgroundColor: Color({ label: 'Background color' }),
      navItemColor: Color({ label: 'Nav item color' }),
      logoImage: Image({ label: 'Logo image' }),
      logoWidth: Number({ label: 'Logo width', suffix: 'px', defaultValue: 120 }),
      logoLink: Link({ label: 'Logo link' }),
      navItems: List({
        label: 'Nav items',
        type: Group({
          label: 'Nav item',
          props: {
            linkText: TextInput({ label: 'Link text', defaultValue: 'Link' }),
            linkUrl: Link({ label: 'Link URL' }),
          },
        }),
        getItemLabel(item) {
          return item?.linkText ?? 'Link'
        },
      }),
    },
  }
)
