import type { DesignDefinitionType } from '../types';
import { classic } from './classic';

export type { DesignDefinitionType } from '../types';

export const DESIGN_LIST: Array<DesignDefinitionType> = [classic];

export const DESIGN_MAP: Record<string, DesignDefinitionType> =
  Object.fromEntries(DESIGN_LIST.map((design) => [design.id, design]));
