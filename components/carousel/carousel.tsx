import type { ReactNode } from 'react';
import { Carousel } from 'storefront-kit';

import { MSEmptyState } from '../empty-state/empty-state';

interface MSCarouselProps {
  className?: string;
  items?: Array<{ content: ReactNode }>;
  showScrollbar?: boolean;
  showNav?: boolean;
}

export function MSCarousel({ className, items = [], showScrollbar, showNav }: MSCarouselProps) {
  if (items.length === 0) {
    return <MSEmptyState className={className}>No carousel items to display</MSEmptyState>;
  }

  return (
    <Carousel
      className={className}
      items={items.map((slide) => slide.content ?? null)}
      showNav={showNav}
      showScrollbar={showScrollbar}
    />
  );
}
