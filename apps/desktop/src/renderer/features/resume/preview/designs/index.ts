import { classic } from './classic';

export type DesignDefinitionType = {
  id: string;
  label: string;
  css: string;
};

export const DESIGN_LIST: Array<DesignDefinitionType> = [classic];

export const DESIGN_MAP: Record<string, DesignDefinitionType> =
  Object.fromEntries(DESIGN_LIST.map((d) => [d.id, d]));
