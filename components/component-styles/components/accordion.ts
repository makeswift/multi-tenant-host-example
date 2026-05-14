import { Color, Font, Group } from '@makeswift/runtime/controls';

export const accordionThemePropDefinitions = Group({
  label: 'Accordion',
  preferredLayout: Group.Layout.Popover,
  props: {
    fontTitle: Font({
      label: 'Title font',
      variant: false,
      defaultValue: { fontFamily: 'inherit' },
    }),
    fontBody: Font({
      label: 'Body font',
      variant: false,
      defaultValue: { fontFamily: 'inherit' },
    }),
    textPrimary: Color({ label: 'Primary text' }),
    textSecondary: Color({ label: 'Secondary text' }),
    fillIcon: Color({ label: 'Icon color' }),
  },
});
