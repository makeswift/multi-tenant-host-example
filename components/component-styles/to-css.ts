export type ThemeProps = {
  [key in string]?: string | number | ThemeProps;
};

function toKebab(str: string) {
  let result = '';

  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);

    if (char >= 'A' && char <= 'Z') {
      result += `-${char.toLowerCase()}`;
    } else {
      result += char;
    }
  }

  return result;
}

const toCssVar = (name: string, value: string) => `--${toKebab(name)}: ${value};`;

interface Options {
  valueTransform?: (value: string) => string;
}

function isFontToken(prop: unknown): prop is { fontFamily: string } {
  return typeof prop === 'object' && prop != null && 'fontFamily' in prop;
}

function propToCssVars(
  key: string,
  prop: string | number | ThemeProps | null | undefined,
  options: Options,
): string | string[] {
  if (prop == null) {
    return toCssVar(key, 'initial');
  }

  if (typeof prop === 'string') {
    const { valueTransform } = options;

    return toCssVar(key, valueTransform ? valueTransform(prop) : prop);
  }

  if (typeof prop === 'number') {
    return toCssVar(key, `${prop}px`);
  }

  if (isFontToken(prop)) {
    return toCssVar(key, prop.fontFamily);
  }

  return Object.entries(prop).flatMap(([subKey, subProp]) =>
    propToCssVars(`${key}-${subKey}`, subProp, options),
  );
}

export const themeToCssVars = (theme: ThemeProps, options: Options = {}): string[] =>
  Object.entries(theme).flatMap(([key, prop]) => propToCssVars(key, prop, options));
