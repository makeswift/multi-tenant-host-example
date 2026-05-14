'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/makeswift/utils/cn'

interface NavItem {
  linkText?: string
  linkUrl?: { href: string; target?: string }
}

interface NavigationProps {
  className?: string
  backgroundColor?: string
  navItemColor?: string
  logoImage?: string
  logoWidth?: number
  logoLink?: { href: string; target?: string }
  navItems?: NavItem[]
}

export function Navigation({
  className,
  backgroundColor,
  navItemColor,
  logoImage,
  logoWidth = 120,
  logoLink,
  navItems = [],
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoElement = logoImage ? (
    <Image
      alt="Logo"
      height={Math.round(logoWidth * 0.5)}
      src={logoImage}
      style={{ width: logoWidth, height: 'auto' }}
      width={logoWidth}
    />
  ) : null

  const wrappedLogo = logoLink?.href ? (
    <a href={logoLink.href} target={logoLink.target}>
      {logoElement}
    </a>
  ) : (
    logoElement
  )

  return (
    <nav
      className={cn('relative w-full py-6 pl-6 pr-8', className)}
      style={{ backgroundColor: backgroundColor ?? 'transparent' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex shrink-0 items-center">{wrappedLogo}</div>

        {/* Desktop nav items */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item, i) => (
            <li key={i}>
              <a
                className="text-lg font-medium no-underline transition-opacity hover:opacity-70"
                href={item.linkUrl?.href ?? '#'}
                style={{ color: navItemColor ?? 'currentColor' }}
                target={item.linkUrl?.target}
              >
                {item.linkText ?? 'Link'}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          type="button"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item, i) => (
              <li key={i}>
                <a
                  className="block rounded px-3 py-2 text-sm font-medium no-underline transition-opacity hover:opacity-70"
                  href={item.linkUrl?.href ?? '#'}
                  style={{ color: navItemColor ?? 'currentColor' }}
                  onClick={() => setMobileMenuOpen(false)}
                  target={item.linkUrl?.target}
                >
                  {item.linkText ?? 'Link'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
