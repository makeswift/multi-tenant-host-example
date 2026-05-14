import { Color, Font, Group } from '@makeswift/runtime/controls';

export const buttonThemePropDefinitions = Group({
  label: 'Button',
  preferredLayout: Group.Layout.Popover,
  props: {
    font: Font({
      label: 'Font',
      variant: false,
      defaultValue: { fontFamily: 'inherit' },
    }),
    primary: Group({
      label: 'Primary',
      preferredLayout: Group.Layout.Inline,
      props: {
        fill: Color({ label: 'Fill' }),
        text: Color({ label: 'Text' }),
      },
    }),
    brand: Group({
      label: 'Brand',
      preferredLayout: Group.Layout.Inline,
      props: {
        fill: Color({ label: 'Fill' }),
        text: Color({ label: 'Text' }),
      },
    }),
    outline: Group({
      label: 'Outline',
      preferredLayout: Group.Layout.Inline,
      props: {
        fill: Color({ label: 'Fill' }),
        text: Color({ label: 'Text' }),
        stroke: Color({ label: 'Border' }),
        fillHover: Color({ label: 'Hover fill' }),
      },
    }),
    ghost: Group({
      label: 'Ghost',
      preferredLayout: Group.Layout.Inline,
      props: {
        text: Color({ label: 'Text' }),
        fillHover: Color({ label: 'Hover fill' }),
      },
    }),
  },
});
