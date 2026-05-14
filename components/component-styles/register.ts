import { lazy } from 'react'

import { Group } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { accordionThemePropDefinitions } from './components/accordion'
import { buttonThemePropDefinitions } from './components/button'
import { carouselThemePropDefinitions } from './components/carousel'
import { tabsThemePropDefinitions } from './components/tabs'

export const COMPONENT_STYLES_TYPE = 'stencil-site-theme'

runtime.registerComponent(
  lazy(() => import('./client').then(mod => ({ default: mod.ComponentStylesClient }))),
  {
    type: COMPONENT_STYLES_TYPE,
    label: 'Component Styles',
    hidden: true,
    props: {
      components: Group({
        label: 'Components',
        props: {
          accordion: accordionThemePropDefinitions,
          button: buttonThemePropDefinitions,
          carousel: carouselThemePropDefinitions,
          tabs: tabsThemePropDefinitions,
        },
      }),
    },
  }
)
