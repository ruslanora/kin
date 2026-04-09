import { contextBridge, ipcRenderer } from 'electron';

import type {
  BoardType,
  ColumnType,
  CompanyType,
  ContactType,
  CoverLetterType,
  FileType,
  InterviewType,
  InterviewWithJobType,
  JobWithCompanyType,
  ResumeContentType,
  ResumeSectionType,
  ResumeType,
  ResumeWithSectionsType,
} from '../main/database';

const api = {
  theme: {
    set: async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
      await ipcRenderer.invoke('theme:set', theme);
    },

    onChange: (callback: (theme: boolean) => void): (() => void) => {
      const listener = (_: Electron.IpcRendererEvent, theme: boolean) =>
        callback(theme);
      ipcRenderer.on('theme:changed', listener);
      return () => ipcRenderer.removeListener('theme:changed', listener);
    },
  },

  data: {
    export: async (): Promise<void> => {
      await ipcRenderer.invoke('data:export');
    },

    flush: async (): Promise<void> => {
      await ipcRenderer.invoke('data:flush');
    },
  },

  board: {
    getActive: async () =>
      (await ipcRenderer.invoke('board:getActive')) as Promise<BoardType>,

    getArchived: async () =>
      (await ipcRenderer.invoke('board:getArchived')) as Promise<
        Array<BoardType>
      >,

    getColumns: async (args: { boardId: number }) =>
      (await ipcRenderer.invoke('board:getColumns', args)) as Promise<
        Array<ColumnType>
      >,

    addColumn: async (args: { boardId: number; name: string }) =>
      (await ipcRenderer.invoke('board:addColumn', args)) as ColumnType,

    updateColumn: async (args: { id: number; name: string }) =>
      (await ipcRenderer.invoke('board:updateColumn', args)) as ColumnType,

    deleteColumn: async (args: { id: number }) => {
      await ipcRenderer.invoke('board:deleteColumn', args);
    },

    reorderColumns: async (args: { orderedIds: number[] }) => {
      await ipcRenderer.invoke('board:reorderColumns', args);
    },

    archive: async (args: { id: number }) =>
      (await ipcRenderer.invoke('board:archive', args)) as BoardType,
  },

  company: {
    getAll: async () =>
      (await ipcRenderer.invoke('company:getAll')) as Array<CompanyType>,

    getById: async (args: { id: number }) =>
      (await ipcRenderer.invoke('company:getById', args)) as CompanyType | null,

    update: async (args: { id: number; [key: string]: unknown }) =>
      (await ipcRenderer.invoke('company:update', args)) as CompanyType,
  },

  contact: {
    getAll: async () =>
      (await ipcRenderer.invoke('contact:getAll')) as Array<
        ContactType & { companyName: string | null }
      >,

    getByJob: async (args: { jobId: number }) =>
      (await ipcRenderer.invoke(
        'contact:getByJob',
        args,
      )) as Array<ContactType>,

    create: async (args: {
      jobId: number;
      firstName: string;
      lastName: string;
      title?: string | null;
      email?: string | null;
      linkedin?: string | null;
      note?: string | null;
    }) => (await ipcRenderer.invoke('contact:create', args)) as ContactType,

    update: async (args: { id: number; [key: string]: unknown }) =>
      (await ipcRenderer.invoke('contact:update', args)) as ContactType,

    delete: async (args: { id: number }) => {
      await ipcRenderer.invoke('contact:delete', args);
    },
  },

  interview: {
    getAll: async () =>
      (await ipcRenderer.invoke(
        'interview:getAll',
      )) as Array<InterviewWithJobType>,

    getByMonth: async (year: number, month: number) =>
      (await ipcRenderer.invoke('interview:getByMonth', {
        year,
        month,
      })) as Array<InterviewWithJobType>,

    getByJob: async (args: { jobId: number }) =>
      (await ipcRenderer.invoke(
        'interview:getByJob',
        args,
      )) as Array<InterviewType>,

    create: async (args: {
      jobId: number;
      scheduledAt: number;
      round?: string | null;
      note?: string | null;
      followUp?: boolean;
    }) => (await ipcRenderer.invoke('interview:create', args)) as InterviewType,

    update: async (args: {
      id: number;
      scheduledAt?: number;
      round?: string | null;
      note?: string | null;
      followUp?: boolean;
    }) => (await ipcRenderer.invoke('interview:update', args)) as InterviewType,

    delete: async (args: { id: number }) => {
      await ipcRenderer.invoke('interview:delete', args);
    },
  },

  file: {
    getByJob: async (args: {
      jobId: number;
      fileType: 'resume' | 'cover_letter';
    }) => (await ipcRenderer.invoke('file:getByJob', args)) as Array<FileType>,

    upload: async (args: {
      jobId: number;
      fileType: 'resume' | 'cover_letter';
      fileName: string;
      buffer: number[];
    }) => {
      const MAX_FILE_SIZE = 1024 * 1024;

      if (args.buffer.length > MAX_FILE_SIZE) {
        throw new Error('File exceeds the 50 MB size limit');
      }

      return (await ipcRenderer.invoke('file:upload', args)) as FileType;
    },

    open: async (args: { id: number }) => {
      await ipcRenderer.invoke('file:open', args);
    },

    delete: async (args: { id: number }) => {
      await ipcRenderer.invoke('file:delete', args);
    },
  },

  resume: {
    getMaster: async () =>
      (await ipcRenderer.invoke('resume:getMaster')) as ResumeWithSectionsType,

    getById: async (args: { id: number }) =>
      (await ipcRenderer.invoke(
        'resume:getById',
        args,
      )) as ResumeWithSectionsType,

    fork: async () =>
      (await ipcRenderer.invoke('resume:fork')) as ResumeWithSectionsType,

    deleteById: async (args: { id: number }) => {
      await ipcRenderer.invoke('resume:deleteById', args);
    },

    update: async (args: { id: number } & Partial<ResumeType>) =>
      (await ipcRenderer.invoke('resume:update', args)) as ResumeType,

    upsertSection: async (
      args: Partial<ResumeSectionType> & {
        resumeId: number;
        contentType: 'period' | 'category' | 'list';
      },
    ) =>
      (await ipcRenderer.invoke(
        'resume:upsertSection',
        args,
      )) as ResumeSectionType,

    deleteSection: async (args: { id: number }) => {
      await ipcRenderer.invoke('resume:deleteSection', args);
    },

    reorderSections: async (args: { orderedIds: number[] }) => {
      await ipcRenderer.invoke('resume:reorderSections', args);
    },

    upsertContent: async (
      args: Partial<ResumeContentType> & { sectionId: number },
    ) =>
      (await ipcRenderer.invoke(
        'resume:upsertContent',
        args,
      )) as ResumeContentType,

    deleteContent: async (args: { id: number }) => {
      await ipcRenderer.invoke('resume:deleteContent', args);
    },

    reorderContents: async (args: { orderedIds: number[] }) => {
      await ipcRenderer.invoke('resume:reorderContents', args);
    },

    exportTxt: async (args: { text: string; filename: string }) => {
      await ipcRenderer.invoke('resume:exportTxt', args);
    },

    generatePdf: async (args: { html: string; filename: string }) => {
      await ipcRenderer.invoke('resume:generatePdf', args);
    },
  },

  coverLetter: {
    getMaster: async () =>
      (await ipcRenderer.invoke('coverLetter:getMaster')) as CoverLetterType,

    getOrCreateForResume: async (args: { resumeId: number }) =>
      (await ipcRenderer.invoke(
        'coverLetter:getOrCreateForResume',
        args,
      )) as CoverLetterType,

    update: async (args: { id: number; content: string }) =>
      (await ipcRenderer.invoke('coverLetter:update', args)) as CoverLetterType,
  },

  job: {
    getByBoard: async (args: { boardId: number }) =>
      (await ipcRenderer.invoke(
        'job:getByBoard',
        args,
      )) as Array<JobWithCompanyType>,

    create: async (args: {
      columnId: number;
      title?: string;
      url?: string;
      companyName: string;
      description?: string;
    }) => (await ipcRenderer.invoke('job:create', args)) as JobWithCompanyType,

    getById: async (args: { id: number }) =>
      (await ipcRenderer.invoke(
        'job:getById',
        args,
      )) as JobWithCompanyType | null,

    update: async (args: { id: number; [key: string]: unknown }) =>
      (await ipcRenderer.invoke('job:update', args)) as JobWithCompanyType,

    getByCompany: async (args: { companyId: number }) =>
      (await ipcRenderer.invoke(
        'job:getByCompany',
        args,
      )) as Array<JobWithCompanyType>,

    getByContact: async (args: { contactId: number }) =>
      (await ipcRenderer.invoke(
        'job:getByContact',
        args,
      )) as Array<JobWithCompanyType>,

    delete: async (args: { id: number }) => {
      await ipcRenderer.invoke('job:delete', args);
    },

    reorder: async (args: {
      sourceColumnId: number;
      sourceOrderedIds: Array<number>;

      targetColumnId: number;
      targetOrderedIds: Array<number>;
    }) => {
      await ipcRenderer.invoke('job:reorder', args);
    },

    onCreatedByExtension: (callback: () => void): (() => void) => {
      const listener = () => callback();

      ipcRenderer.on('job:created-by-extension', listener);

      return () => {
        ipcRenderer.removeListener('job:created-by-extension', listener);
      };
    },
  },
};

export type Api = typeof api;

contextBridge.exposeInMainWorld('api', api);
