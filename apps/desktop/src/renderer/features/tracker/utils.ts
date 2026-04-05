import type { BoardType } from '@kin/desktop/main/database/schema';

import { formatDate } from '../../utils/datetime';

export const boardLabel = (board: BoardType, active: boolean): string =>
  `${formatDate(new Date(board.createdAt))} – ${active || !board.archivedAt ? 'Present' : formatDate(new Date(board.archivedAt))}`;
