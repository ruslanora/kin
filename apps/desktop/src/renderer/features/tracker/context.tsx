import type {
  BoardType,
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database/schema';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type ContextType = {
  editing: boolean;
  setEditing: (value: boolean) => void;
  loading: boolean;
  error: boolean;
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

const fetchColumns = (id: number) =>
  window.api.board.getColumns({ boardId: id });

const fetchJobs = (id: number) => window.api.job.getByBoard({ boardId: id });

export const TrackerContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [board, setBoard] = useState<BoardType>({} as BoardType);
  const [columns, setColumns] = useState<Array<ColumnType>>([]);
  const [jobs, setJobs] = useState<Array<JobWithCompanyType>>([]);

  const [activeBoard, setActiveBoard] = useState<BoardType>({} as BoardType);
  const [archivedBoards, setArchivedBoards] = useState<Array<BoardType>>([]);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const addColumn = async (name: string): Promise<ColumnType | null> => {
    try {
      const column = await window.api.board.addColumn({
        boardId: board.id,
        name,
      });

      setColumns((previous) => [...previous, column]);

      return column;
    } catch {
      setError(true);
    }

    return null;
  };

  const updateColumn = async (id: number, name: string): Promise<void> => {
    const updated = await window.api.board.updateColumn({ id, name });

    setColumns((previous) =>
      previous.map((column) => (column.id === id ? updated : column)),
    );
  };

  const moveColumns = async (orderedIds: Array<number>): Promise<void> => {
    await window.api.board.reorderColumns({ orderedIds });

    setColumns((previous) => {
      const map = new Map(previous.map((column) => [column.id, column]));
      return orderedIds.map((id) => map.get(id)!).filter(Boolean);
    });
  };

  const deleteColumn = async (id: number): Promise<void> => {
    await window.api.board.deleteColumn({ id });
    setColumns((previous) => previous.filter((column) => column.id !== id));
  };

  const addJob = async (data: {
    title?: string;
    url?: string;
    companyName: string;
    description?: string;
  }): Promise<JobWithCompanyType> => {
    const job = await window.api.job.create({
      columnId: columns[0].id,
      ...data,
    });

    setJobs((previous) => [...previous, job]);

    return job;
  };

  const moveJob = async (
    jobId: number,
    sourceColumnId: number,
    targetColumnId: number,
    targetIndex: number,
  ): Promise<void> => {
    const movingJob = jobs.find((job) => job.id === jobId)!;

    const sourceJobs = jobs
      .filter((job) => job.columnId === sourceColumnId && job.id !== jobId)
      .sort((jobA, jobB) => jobA.order - jobB.order);

    const targetJobs = jobs
      .filter((job) => job.columnId === targetColumnId && job.id !== jobId)
      .sort((jobA, jobB) => jobA.order - jobB.order);

    const newTargetJobs = [...targetJobs];

    newTargetJobs.splice(targetIndex, 0, {
      ...movingJob,
      columnId: targetColumnId,
    });

    const isCrossColumn = sourceColumnId !== targetColumnId;
    const sourceOrderedIds = isCrossColumn
      ? sourceJobs.map((job) => job.id)
      : [];
    const targetOrderedIds = newTargetJobs.map((job) => job.id);

    setJobs((previous) => {
      const otherJobs = previous.filter(
        (job) =>
          job.columnId !== sourceColumnId && job.columnId !== targetColumnId,
      );

      const updatedSource = isCrossColumn
        ? sourceJobs.map((job, jobIndex) => ({ ...job, order: jobIndex }))
        : [];

      const updatedTarget = newTargetJobs.map((job, jobIndex) => ({
        ...job,
        order: jobIndex,
      }));

      return [...otherJobs, ...updatedSource, ...updatedTarget];
    });

    await window.api.job.reorder({
      sourceColumnId,
      sourceOrderedIds,
      targetColumnId,
      targetOrderedIds,
    });
  };

  const deleteJob = async (id: number): Promise<void> => {
    await window.api.job.delete({ id });
    setJobs((previous) => previous.filter((job) => job.id !== id));
  };

  useEffect(() => {
    if (!activeBoard.id) return;

    return window.api.job.onCreatedByExtension(async () => {
      if (board.id !== activeBoard.id) return;
      const updated = await fetchJobs(activeBoard.id);
      setJobs(updated);
    });
  }, [board.id, activeBoard.id]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const [initialBoard, archived] = await Promise.all([
          window.api.board.getActive(),
          window.api.board.getArchived(),
        ]);

        const [initialColumns, initialJobs] = await Promise.all([
          fetchColumns(initialBoard.id),
          fetchJobs(initialBoard.id),
        ]);

        setBoard(initialBoard);
        setActiveBoard(initialBoard);
        setArchivedBoards(archived);
        setColumns(initialColumns);
        setJobs(initialJobs);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const switchBoard = async (id: number): Promise<void> => {
    try {
      setLoading(true);

      const target = [activeBoard, ...archivedBoards].find(
        (candidate) => candidate.id === id,
      );

      if (!target) return;

      const [targetColumns, targetJobs] = await Promise.all([
        fetchColumns(target.id),
        fetchJobs(target.id),
      ]);

      setBoard(target);
      setColumns(targetColumns);
      setJobs(targetJobs);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const archiveBoard = async (): Promise<void> => {
    try {
      setLoading(true);

      const newBoard = await window.api.board.archive({ id: activeBoard.id });

      const [newColumns, newJobs] = await Promise.all([
        fetchColumns(newBoard.id),
        fetchJobs(newBoard.id),
      ]);

      setArchivedBoards((previous) => [activeBoard, ...previous]);
      setActiveBoard(newBoard);
      setBoard(newBoard);
      setColumns(newColumns);
      setJobs(newJobs);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const context = {
    editing,
    setEditing,
    loading,
    error,
    board,
    columns,
    addColumn,
    moveColumns,
    updateColumn,
    deleteColumn,
    activeBoard,
    archiveBoard,
    archivedBoards,
    switchBoard,
    jobs,
    addJob,
    moveJob,
    deleteJob,
  };

  return (
    <TrackerContext.Provider value={context}>
      {children}
    </TrackerContext.Provider>
  );
};
