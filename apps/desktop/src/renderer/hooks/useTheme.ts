import { useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

type HookReturnType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const compute = (theme: ThemeType): boolean =>
  theme === 'dark' ||
  (theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);

const apply = (dark: boolean): void => {
  document.documentElement.classList.toggle('dark', dark);
};

export const useTheme = (): HookReturnType => {
  const stored = localStorage.getItem('theme') as ThemeType | null;
  const [theme, setThemeState] = useState<ThemeType>(stored ?? 'system');

  useEffect(() => {
    apply(compute(theme));

    void window.api.theme.set(theme);

    const cleanup = window.api.theme.onChange((dark: boolean) => {
      apply(dark);
      setThemeState((current) => {
        if (current === 'system') apply(dark);
        return current;
      });
    });

    return cleanup;
  }, []);

  const setTheme = (value: ThemeType) => {
    localStorage.setItem('theme', value);

    setThemeState(value);
    apply(compute(value));

    void window.api.theme.set(value);
  };

  return { theme, setTheme };
};
