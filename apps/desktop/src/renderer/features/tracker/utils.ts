import type { BoardType } from '@kin/desktop/main/database/schema';

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

export const boardLabel = (board: BoardType, active: boolean): string =>
  `${formatDate(new Date(board.createdAt))} – ${active || !board.archivedAt ? 'Present' : formatDate(new Date(board.archivedAt))}`;
