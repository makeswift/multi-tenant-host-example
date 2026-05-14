import { lazy } from 'react'

import { Link, Select, Style, TextInput } from '@makeswift/runtime/controls'
import { MakeswiftComponentType } from '@makeswift/runtime/react/builtins'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./button').then(({ MSButton }) => ({ default: MSButton }))),
  {
    type: MakeswiftComponentType.Button,
    label: 'Button',
    icon: 'button',
    props: {
      className: Style({ properties: [Style.Margin] }),
      children: TextInput({ label: 'Label', defaultValue: 'Button' }),
      variant: Select({
        label: 'Variant',
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'brand', label: 'Brand' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' },
        ],
        defaultValue: 'primary',
      }),
      size: Select({
        label: 'Size',
        options: [
          { value: 'x-small', label: 'X-Small' },
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        defaultValue: 'medium',
      }),
      shape: Select({
        label: 'Shape',
        options: [
          { value: 'rounded', label: 'Rounded' },
          { value: 'pill', label: 'Pill' },
          { value: 'square', label: 'Square' },
        ],
        defaultValue: 'rounded',
      }),
      link: Link({ label: 'Link' }),
    },
  }
)
