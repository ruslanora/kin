import { asc, desc, eq, isNotNull, isNull, max } from 'drizzle-orm';

import { boards, columns, getDb } from '../database';
import { handle } from './handle';

const DEFAULT_COLUMNS = [
  'Bookmarked',
  'Applied',
  'Screening Call',
  'Interviewing',
  'Offer Accepted',
  'Ghosted',
  'Rejected',
];

export const registerBoardHandlers = (): void => {
  handle('board:getActive', () => {
    const db = getDb();

    const existing = db
      .select()
      .from(boards)
      .where(isNull(boards.archivedAt))
      .limit(1)
      .get();

    if (existing) return existing;

    return db.transaction((table) => {
      const board = table
        .insert(boards)
        .values({ name: 'New Job Hunt', createdAt: new Date() })
        .returning()
        .get();

      DEFAULT_COLUMNS.forEach((name, index) => {
        table
          .insert(columns)
          .values({ boardId: board.id, name, order: index })
          .run();
      });

      return board;
    });
  });

  handle('board:getColumns', (_event, { boardId }: { boardId: number }) => {
    const db = getDb();

    return db
      .select()
      .from(columns)
      .where(eq(columns.boardId, boardId))
      .orderBy(asc(columns.order))
      .all();
  });

  handle(
    'board:addColumn',
    (_event, { boardId, name }: { boardId: number; name: string }) => {
      const db = getDb();

      const result = db
        .select({ maxOrder: max(columns.order) })
        .from(columns)
        .where(eq(columns.boardId, boardId))
        .get();

      const nextOrder =
        result?.maxOrder !== null && result?.maxOrder !== undefined
          ? result.maxOrder + 1
          : 0;

      return db
        .insert(columns)
        .values({ boardId, name, order: nextOrder })
        .returning()
        .get();
    },
  );

  handle(
    'board:updateColumn',
    (_event, { id, name }: { id: number; name: string }) => {
      const db = getDb();

      return db
        .update(columns)
        .set({ name })
        .where(eq(columns.id, id))
        .returning()
        .get();
    },
  );

  handle('board:deleteColumn', (_event, { id }: { id: number }) => {
    const db = getDb();
    db.delete(columns).where(eq(columns.id, id)).run();
  });

  handle(
    'board:reorderColumns',
    (_event, { orderedIds }: { orderedIds: number[] }) => {
      const db = getDb();

      db.transaction((table) => {
        orderedIds.forEach((id, index) => {
          table
            .update(columns)
            .set({ order: index })
            .where(eq(columns.id, id))
            .run();
        });
      });
    },
  );

  handle('board:getArchived', () => {
    const db = getDb();

    return db
      .select()
      .from(boards)
      .where(isNotNull(boards.archivedAt))
      .orderBy(desc(boards.archivedAt))
      .all();
  });

  handle('board:archive', (_event, { id }: { id: number }) => {
    const db = getDb();

    return db.transaction((table) => {
      table
        .update(boards)
        .set({ archivedAt: new Date() })
        .where(eq(boards.id, id))
        .run();

      const newBoard = table
        .insert(boards)
        .values({ name: 'New Job Hunt', createdAt: new Date() })
        .returning()
        .get();

      DEFAULT_COLUMNS.forEach((name, index) => {
        table
          .insert(columns)
          .values({ boardId: newBoard.id, name, order: index })
          .run();
      });

      return newBoard;
    });
  });
};
