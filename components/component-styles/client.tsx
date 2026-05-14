import { type ThemeProps, themeToCssVars } from './to-css';

interface ComponentStylesProps {
  components?: ThemeProps;
}

export function ComponentStylesClient({ components }: ComponentStylesProps) {
  const vars = themeToCssVars({ sfk: components ?? {} });

  if (vars.length === 0) {
    return null;
  }

  return <style data-makeswift="theme">{`:root { ${vars.join('\n')} }`}</style>;
}
