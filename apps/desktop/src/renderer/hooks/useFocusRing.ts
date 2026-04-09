import { useEffect, useState } from 'react';

type HookReturnType = {
  focusRing: boolean;
  setFocusRing: (enabled: boolean) => void;
};

const STORAGE_KEY = 'focus-ring';

const apply = (enabled: boolean): void => {
  document.body.classList.toggle('no-focus-ring', !enabled);
};

export const useFocusRing = (): HookReturnType => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const [focusRing, setFocusRingState] = useState<boolean>(
    stored === null ? false : stored === 'true',
  );

  useEffect(() => {
    apply(focusRing);
  }, []);

  const setFocusRing = (enabled: boolean): void => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    setFocusRingState(enabled);
    apply(enabled);
  };

  return { focusRing, setFocusRing };
};
