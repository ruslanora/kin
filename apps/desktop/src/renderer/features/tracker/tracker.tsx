import type {
  BoardType,
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database/schema';
import { Spinner, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';

import { Board } from './board';
import { TrackerContext } from './context';
import { Toolbar } from './toolbar';

export const Tracker: FunctionComponent = () => {
  const [board, setBoard] = useState<BoardType>({} as BoardType);
  const [columns, setColumns] = useState<Array<ColumnType>>([]);
  const [jobs, setJobs] = useState<Array<JobWithCompanyType>>([]);

  const [activeBoard, setActiveBoard] = useState<BoardType>({} as BoardType);
  const [archivedBoards, setArchivedBoards] = useState<Array<BoardType>>([]);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchColumns = (id: number) =>
    window.api.board.getColumns({ boardId: id });

  const fetchJobs = (id: number) => window.api.job.getByBoard({ boardId: id });

  const addColumn = async (name: string): Promise<ColumnType | null> => {
    try {
      const column = await window.api.board.addColumn({
        boardId: board.id,
        name,
      });

      setColumns((state) => [...state, column]);

      return column;
    } catch {
      setError(true);
    }

    return null;
  };

  const updateColumn = async (id: number, name: string): Promise<void> => {
    const updated = await window.api.board.updateColumn({ id, name });

    setColumns((state) =>
      state.map((column) => (column.id === id ? updated : column)),
    );
  };

  const moveColumns = async (orderedIds: Array<number>): Promise<void> => {
    await window.api.board.reorderColumns({ orderedIds });

    setColumns((state) => {
      const map = new Map(state.map((column) => [column.id, column]));
      return orderedIds.map((id) => map.get(id)!).filter(Boolean);
    });
  };

  const deleteColumn = async (id: number): Promise<void> => {
    await window.api.board.deleteColumn({ id });
    setColumns((state) => state.filter((column) => column.id !== id));
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

    setJobs((state) => [...state, job]);

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
      .sort((a, b) => a.order - b.order);

    const targetJobs = jobs
      .filter((job) => job.columnId === targetColumnId && job.id !== jobId)
      .sort((a, b) => a.order - b.order);

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

    setJobs((state) => {
      const otherJobs = state.filter(
        (job) =>
          job.columnId !== sourceColumnId && job.columnId !== targetColumnId,
      );

      const updatedSource = isCrossColumn
        ? sourceJobs.map((job, index) => ({ ...job, order: index }))
        : [];

      const updatedTarget = newTargetJobs.map((job, i) => ({
        ...job,
        order: i,
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
    setJobs((state) => state.filter((job) => job.id !== id));
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const [board, archived] = await Promise.all([
          window.api.board.getActive(),
          window.api.board.getArchived(),
        ]);

        const [columns, jobs] = await Promise.all([
          fetchColumns(board.id),
          fetchJobs(board.id),
        ]);

        setBoard(board);
        setActiveBoard(board);
        setArchivedBoards(archived);
        setColumns(columns);
        setJobs(jobs);
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
        (board) => board.id === id,
      );

      if (!target) return;

      const [columns, jobs] = await Promise.all([
        fetchColumns(target.id),
        fetchJobs(target.id),
      ]);

      setBoard(target);
      setColumns(columns);
      setJobs(jobs);
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

      const [columns, jobs] = await Promise.all([
        fetchColumns(newBoard.id),
        fetchJobs(newBoard.id),
      ]);

      setArchivedBoards((state) => [activeBoard, ...state]);
      setActiveBoard(newBoard);
      setBoard(newBoard);
      setColumns(columns);
      setJobs(jobs);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !board.id) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
        <Typography.Heading as="h2">
          Oops! Something went wrong.
        </Typography.Heading>
        <Typography.Paragraph>
          The tool is broken and we are (probably) working on it.
        </Typography.Paragraph>
      </div>
    );
  }

  const context = {
    editing,
    setEditing,
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
      <div className="h-full w-full flex flex-col items-stretch justify-start">
        <Toolbar />
        <Board />
      </div>
    </TrackerContext.Provider>
  );
};
