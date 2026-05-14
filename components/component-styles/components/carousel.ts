import { Color, Group } from '@makeswift/runtime/controls';

export const carouselThemePropDefinitions = Group({
  label: 'Carousel',
  preferredLayout: Group.Layout.Popover,
  props: {
    fillScrollbar: Color({ label: 'Scrollbar color' }),
    fillNav: Color({ label: 'Nav icon color' }),
  },
});
