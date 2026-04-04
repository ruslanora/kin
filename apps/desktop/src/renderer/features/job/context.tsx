import type {
  ColumnType,
  JobWithCompanyType,
} from '@kin/desktop/main/database';
import { createContext, useContext } from 'react';

type ContextType = {
  job: JobWithCompanyType;
  columns: Array<ColumnType>;
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
