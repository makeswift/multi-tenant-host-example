import { StrictMode } from 'react'

import { MakeswiftComponentSnapshot } from '@makeswift/runtime/client'
import { MakeswiftComponent, ReactRuntimeProvider } from '@makeswift/runtime/next'
import { type ReactRuntimeCore } from '@makeswift/runtime/react/core'
import { type SiteVersion } from '@makeswift/runtime/unstable-framework-support'

import { COMPONENT_STYLES_TYPE } from './register'

interface Props {
  snapshot: MakeswiftComponentSnapshot | null
  runtime: ReactRuntimeCore
  siteVersion: SiteVersion | null
  locale: string
}

export function ComponentStyles({ snapshot, runtime, siteVersion, locale }: Props) {
  if (snapshot == null) {
    return null
  }

  const componentStylesDescription = `Component Styles let you customize the theming and appearance of Makeswift components. Changes here apply to all instances of a component across your Makeswift site. These styles do not affect content managed directly in your Stencil theme.

## How to update Theme content styles

Components and styles managed by the theme must be configured in Theme Styles directly. Access to Theme Styles can be found in your BigCommerce control panel next to your Stencil theme.

## Using theme colors and fonts

Colors and fonts from your Stencil theme are also not available in Makeswift by default and need to be added in Makeswift manually. You can manage colors and fonts in Makeswift within the Design tab found on the left sidebar.`

  return (
    <StrictMode>
      <ReactRuntimeProvider locale={locale} runtime={runtime} siteVersion={siteVersion}>
        <MakeswiftComponent
          description={componentStylesDescription}
          label="Component Styles"
          snapshot={snapshot}
          type={COMPONENT_STYLES_TYPE}
        />
      </ReactRuntimeProvider>
    </StrictMode>
  )
}
