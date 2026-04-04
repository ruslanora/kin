import type {
  BoardType,
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database/schema';
import { createContext, useContext } from 'react';

type ContextType = {
  editing: boolean;
  setEditing: (value: boolean) => void;
  board: BoardType;
  columns: Array<ColumnType>;
  addColumn: (name: string) => Promise<ColumnType | null>;
  updateColumn: (id: number, name: string) => Promise<void>;
  moveColumns: (orderedIds: Array<number>) => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;
  activeBoard: BoardType;
  archivedBoards: Array<BoardType>;
  archiveBoard: () => Promise<void>;
  switchBoard: (id: number) => Promise<void>;
  jobs: Array<JobWithCompanyType>;
  addJob: (data: {
    title?: string;
    url?: string;
    companyName: string;
    description?: string;
  }) => Promise<JobWithCompanyType>;
  moveJob: (
    jobId: number,
    sourceColumnId: number,
    targetColumnId: number,
    targetIndex: number,
  ) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
};

export const TrackerContext = createContext<ContextType | null>(null);

export const useTracker = (): ContextType => {
  const context = useContext(TrackerContext);

  if (!context) {
    throw new Error('useTracker must be used within TrackerContext provider!');
  }

  return context;
};
