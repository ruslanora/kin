'use client';

import { useState } from 'react';

export type DisclosureReturnType = {
  state: boolean;
  open: () => void;
  close: () => void;
};

export const useDisclosure = (): DisclosureReturnType => {
  const [state, setState] = useState<boolean>(false);

  return {
    state,
    open: () => setState(true),
    close: () => setState(false),
  };
};
