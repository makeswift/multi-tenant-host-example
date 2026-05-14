import { lazy } from 'react'

import { Checkbox, Group, List, Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./carousel').then(({ MSCarousel }) => ({ default: MSCarousel }))),
  {
    type: 'storefront-kit-carousel',
    label: 'Custom / Carousel',
    icon: 'carousel',
    props: {
      className: Style(),
      items: List({
        label: 'Slides',
        type: Group({
          label: 'Slide',
          props: {
            content: Slot(),
          },
        }),
        getItemLabel() {
          return 'Slide'
        },
      }),
      showScrollbar: Checkbox({ label: 'Show scrollbar', defaultValue: true }),
      showNav: Checkbox({ label: 'Show navigation', defaultValue: true }),
    },
  }
)
