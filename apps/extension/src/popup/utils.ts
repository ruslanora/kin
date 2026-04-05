import type { SavedFormType } from './types';

const STORAGE_KEY = 'kin_form';

export const loadSavedForm = async (
  currentUrl: string,
): Promise<SavedFormType | null> => {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const saved = result[STORAGE_KEY] as SavedFormType | undefined;

  if (saved && saved.url === currentUrl) {
    return saved;
  }

  return null;
};

export const persistForm = (form: SavedFormType) => {
  void chrome.storage.local.set({ [STORAGE_KEY]: form });
};

export const clearForm = () => {
  void chrome.storage.local.remove(STORAGE_KEY);
};
