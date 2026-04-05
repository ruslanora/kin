export type ColumnInfoType = { id: number; name: string };

export type JobResultType = {
  id: number;
  title: string | null;
  url: string | null;
  columnId: number;
  companyId: number;
  companyName: string;
  columnName: string;
  appliedAt: string | null;
  createdAt: string;
};

export type CreateJobPayloadType = {
  title: string;
  companyName: string;
  columnId?: number;
  url: string;
  description?: string;
};

export type PopupStateType =
  | { status: 'loading' }
  | { status: 'offline' }
  | { status: 'found'; job: JobResultType }
  | { status: 'not_found'; url: string }
  | { status: 'saved'; job: JobResultType };
