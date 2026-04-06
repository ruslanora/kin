import type {
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database';
import { Spinner, Typography } from '@kin/ui';
import { type FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { JobContext } from './context';
import { TabControl } from './tab-control';
import { Toolbar } from './toolbar';

export const Job: FunctionComponent = () => {
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

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
        <Typography.Heading as="h2">
          Oops! Something went wrong.
        </Typography.Heading>
        <Typography.Paragraph>Could not load this job.</Typography.Paragraph>
      </div>
    );
  }

  return (
    <JobContext.Provider value={{ job, columns, updateJob, deleteJob }}>
      <div className="w-full h-full flex flex-col items-stretch justify-start">
        <Toolbar />
        <div className="w-full max-w-2xl mx-auto">
          <TabControl />
        </div>
      </div>
    </JobContext.Provider>
  );
};
