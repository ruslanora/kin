import type {
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database';
import { Spinner } from '@kin/ui';
import {
  createContext,
  type FunctionComponent,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type ContextType = {
  job: JobWithCompanyType;
  columns: Array<ColumnType>;
  loading: boolean;
  error: boolean;
  updateJob: (data: Record<string, unknown>) => Promise<void>;
  deleteJob: () => Promise<void>;
};

export const JobContext = createContext<ContextType | null>(null);

export const useJob = (): ContextType => {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error('useJob must be used within JobContext provider!');
  }

  return context;
};

export const JobContextProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobWithCompanyType | null>(null);
  const [columns, setColumns] = useState<Array<ColumnType>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const updateJob = async (data: Record<string, unknown>): Promise<void> => {
    const updated = await window.api.job.update({ id: job!.id, ...data });
    setJob({ ...updated, companyName: job!.companyName });
  };

  const deleteJob = async (): Promise<void> => {
    await window.api.job.delete({ id: job!.id });
    navigate('/tracker');
  };

  useEffect(() => {
    if (!id) {
      navigate('/tracker');
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const jobId = Number(id);

        const [fetchedJob, activeBoard, archivedBoards] = await Promise.all([
          window.api.job.getById({ id: jobId }),
          window.api.board.getActive(),
          window.api.board.getArchived(),
        ]);

        if (!fetchedJob) {
          navigate('/tracker');
          return;
        }

        const allBoards = [activeBoard, ...archivedBoards];
        const columnsArrays = await Promise.all(
          allBoards.map((board) =>
            window.api.board.getColumns({ boardId: board.id }),
          ),
        );

        const jobColumns =
          columnsArrays.find((cols: ColumnType[]) =>
            cols.some((col) => col.id === fetchedJob.columnId),
          ) ?? [];

        setJob(fetchedJob);
        setColumns(jobColumns);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!job) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <JobContext.Provider
      value={{ job: job, columns, loading, error, updateJob, deleteJob }}
    >
      {children}
    </JobContext.Provider>
  );
};
