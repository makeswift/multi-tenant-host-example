import { Color, Font, Group } from '@makeswift/runtime/controls';

export const tabsThemePropDefinitions = Group({
  label: 'Tabs',
  preferredLayout: Group.Layout.Popover,
  props: {
    font: Font({
      label: 'Font',
      variant: false,
      defaultValue: { fontFamily: 'inherit' },
    }),
    text: Color({ label: 'Text' }),
    textHover: Color({ label: 'Hover text' }),
    textActive: Color({ label: 'Active text' }),
    underline: Color({ label: 'Underline' }),
    underlineActive: Color({ label: 'Active underline' }),
  },
});
